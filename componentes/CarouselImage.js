import React from "react";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default function CarouselImage(props) {
    const { arrayImages, height, width } = props;
    const renderItem = ({item}) => {
        return <Image style={{width, height}} source={{ uri: item}}/>
    }
    return (
        <Carousel 
            layout={"stack"}
            layoutCardOffset={18}
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
        />
    )
}
