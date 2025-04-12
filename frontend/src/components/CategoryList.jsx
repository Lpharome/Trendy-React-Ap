import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'; 
import './CategoryList.scss';

const CategoryList = ({ categories, onCategoryClick }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="category-slider">
            <h2 className="category-title">Shop by Category</h2>
            
            {/* Navigation Buttons */}
            <button ref={prevRef} className="slider-nav prev">
                <LeftOutlined />
            </button>
            <button ref={nextRef} className="slider-nav next">
                <RightOutlined />
            </button>

            <Swiper
                spaceBetween={20}
                slidesPerView={4}
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    600: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {categories.map((category, index) => (
                    <SwiperSlide key={index}>
                         <div 
                            className="category-item"
                            onClick={() => onCategoryClick(category)}

                        >
                            <img src={category.image} alt={category.name} />
                            <h3>{category.name}</h3>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryList;
