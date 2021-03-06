import {$, $all, numberWithCommas} from '../lib/utils.js';
import {ratingTemplate, detailContentsTemplate} from "../template/DetailTemplate.js";
import {errorPageTemplate} from '../template/ErrorPageTemplate.js';
import {translateDateTime} from '../lib/Translator.js';


class Product {

    upload(formData, callback) {
        // TODO: Spinner
        fetch('/api/products', {
            method: 'post',
            credentials: 'same-origin',
            body: formData
        }).then(response => {
            $all('.form-group .feedback').forEach(feedback => feedback.classList.remove('on'));
            if (!response.ok) {
                return response.json();
            }
            callback(response);
        }).then(responseBody => {
            if (responseBody.errors) {
                throw responseBody.errors;
            }
        }).catch(errors => {
            errors.forEach(({field, message}) => {
                field = field.replace(/\[\d\]/, '');
                const feedback = $(`*[name=${field}]`).closest('.form-group').querySelector('.feedback');
                feedback.innerText = message;
                feedback.classList.add('on');
            });
            $('.feedback.on').focus();
        });
    }

    load(productId){
        return new Promise((resolve, reject)=>{
            fetch(`/api/products/${productId}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    this.loadProductError();
                    return;
                })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(error => {
                });
        });

    }

    setDetailTemplate() {
        $('.detail-contents').insertAdjacentHTML('afterbegin', detailContentsTemplate());
    }

    loadProduct(data) {
        const {product, ownerRating} = data;
        const {owner, status} = product;
        $('.product-name').innerText = product.name;
        $('#product-name').innerText = product.name;
        $('#product-title').innerText = product.title;
        $('#cook').innerText = owner.name;
        const participantPercentage = (product.ordersSize / product.maxParticipant) * 100;

        $('#participate-number').innerHTML =`<div class="progress">
                 <div class="progress-bar" role="progressbar" style="width: ${participantPercentage}%;" aria-valuenow="${participantPercentage}" aria-valuemin="0" aria-valuemax="100">
                    ${product.ordersSize + ' / ' + product.maxParticipant}
                 </div>
            </div>`;


        $('#participate-date').innerText = translateDateTime(product.expireDateTime);
        $('#give-time').innerText = translateDateTime(product.shareDateTime);
        $('#give-place').innerText = owner.address;
        $('#give-plate').innerText = product.isBowlNeeded === true ? '개인 용기 지참' : '나눔 용기 제공';

        $('#nickname').innerText = owner.name;
        $('#region-name').innerText = owner.address;
        $('#product-name').innerText = product.name;
        $('.product-content-title').innerText = product.title;
        $('#product-category').innerText = product.category.name;

        $('#user-image').src = owner.imageUrl ? owner.imageUrl : "/images/blank-profile.png";
        $('#user-image').alt = owner.name;

        $('#user-profile-link').href = '/users/'+owner.id;
        tui.Editor.factory({
            el: $('#product-detail'),
            height: 'auto',
            viewer: true,
            initialValue: product.description
        });


        if(product.price){
            $('#price').innerText = numberWithCommas(product.price);
        }else{
            $('#price').innerText = '무료 나눔';
            $('#price').classList.add('free-price');
            $('.details .unit').remove();
        }
        const userRating = Math.round(ownerRating)
        $('#user-rating').innerHTML = ratingTemplate(userRating);

        const currentStatus = $('.status');
        const registerShareBtn = $('#register-button');

        if(status === 'ON_PARTICIPATING') {
            currentStatus.innerText = '모집중';
            currentStatus.classList.add('on');
            registerShareBtn.innerText = '나눔신청';
            registerShareBtn.classList.add('on');
            registerShareBtn.disabled = false;
        } else if(status === 'FULL_PARTICIPANTS') {
            currentStatus.innerText = '모집완료';
            currentStatus.classList.add('full');
            registerShareBtn.innerText = '모집완료';
            registerShareBtn.classList.add('full');
            registerShareBtn.disabled = true;
        } else {
            currentStatus.innerText = '기간만료';
            currentStatus.classList.add('expired');
            registerShareBtn.innerText = '기간만료';
            registerShareBtn.classList.add('expired');
            registerShareBtn.disabled = true;
        }
    }

    loadProductError(){
        $('.detail-contents .container').remove();
        $('.detail-contents').insertAdjacentHTML('afterbegin', errorPageTemplate());
    }

    loadNearAll(latitude, longitude, offset, limit, success, fail) {
        fetch(`/api/products?latitude=${latitude}&longitude=${longitude}&offset=${offset}&limit=${limit}`
         ).then(response => {
            if (!response.ok) {
                fail('잠시 후 다시 시도해주세요');
            }
            return response.json();
        }).then(({ data }) => {
            success(data);
        }).catch(error => {
            fail(error);
        });
    }
}

export default Product;