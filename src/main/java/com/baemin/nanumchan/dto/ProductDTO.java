package com.baemin.nanumchan.dto;

import com.baemin.nanumchan.domain.DateTimeExpirable;
import com.baemin.nanumchan.domain.Product;
import com.baemin.nanumchan.validate.Currency;
import com.baemin.nanumchan.validate.Expirable;
import com.baemin.nanumchan.validate.Image;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

import static com.baemin.nanumchan.validate.Image.AcceptType.JPG;
import static com.baemin.nanumchan.validate.Image.AcceptType.PNG;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Expirable
public class ProductDTO implements DateTimeExpirable {

    @Nullable
    @Size(max = 5)
    private List<@Image(accept = {JPG, PNG}, size = 1_000_000, width = 1200, height = 1200) MultipartFile> files;

    @NotNull
    @Range(min = 1, max = 7)
    private Long categoryId;

    @NotNull
    @Length(min = 1, max = 50)
    private String name;

    @NotNull
    @Length(min = 1, max = 100)
    private String title;

    @NotNull
    @Currency(max = 1000000, unit = Currency.Unit.HUNDRED)
    private Integer price;

    @NotEmpty
    @Length(max = 100000)
    private String description;

    @NotNull
    @Length(min = 1, max = 50)
    private String address;

    @NotNull
    @Length(min = 1, max = 50)
    private String addressDetail;

    @NotNull
    @DecimalMin("-90.00000")
    @DecimalMax("90.00000")
    private Double latitude;

    @NotNull
    @DecimalMin("-180.00000")
    @DecimalMax("180.00000")
    private Double longitude;

    @NotNull
    @Range(min = 1, max = 6)
    private Integer maxParticipant;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime expireDateTime;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime shareDateTime;

    @NotNull
    private Boolean isBowlNeeded;

    @Override
    public LocalDateTime getStartDateTime() {
        return expireDateTime;
    }

    @Override
    public LocalDateTime getEndDateTime() {
        return shareDateTime;
    }

    public Product toEntity() {
        return Product.builder()
                .name(name)
                .title(title)
                .description(description)
                .price(price)
                .address(address)
                .addressDetail(addressDetail)
                .latitude(latitude)
                .longitude(longitude)
                .maxParticipant(maxParticipant)
                .expireDateTime(expireDateTime)
                .shareDateTime(shareDateTime)
                .isBowlNeeded(isBowlNeeded)
                .build();
    }

}
