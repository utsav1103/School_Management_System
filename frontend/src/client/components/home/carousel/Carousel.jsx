import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import {Typography , Box, Button} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const carouselItems = [
    {   
        image:'https://thumbs.dreamstime.com/b/modern-school-exterior-clean-architecture-green-lawn-sentimental-dusk-scene-359267261.jpg',
        title:'explore our classroom',
        description:'Engaging and Inspirational Learning Experiences',
    },
    {
        image:'https://thumbs.dreamstime.com/b/dark-class-room-interior-chairs-row-blackboard-screen-window-black-white-classroom-table-side-view-mock-up-copy-space-282630479.jpg',
        title:'Empower Your Learning Journey',
        description:'We believe in the power of education.',
    },
    {
        image:'https://buildingbooklove.com/wp-content/uploads/2024/07/Dark-Academia-Classroom-Blog-Post-1024x1024.jpg',
        title:'learning tools',
        description:'enthusiasm and creativity.',
    },
    {
        image:'https://pbs.twimg.com/media/EgSp7pNXsAAE1fx.jpg',
        title:'great learning',
        description:'open your mind.',
    },
    {
        image:'https://imgcdn.stablediffusionweb.com/2024/2/21/abfdc066-f9ac-4a86-9a48-1161e3c5d7fd.jpg',
        title:'Lots of Fun',
        description:'books and games.',
    },
];




export default function Carousel(){
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    };
    const handleBack = () => {
        setActiveIndex((prevIndex) => prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1);
    };
    return (
        <Box  sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <SwipeableViews 
            index={activeIndex} onChangeIndex={(index) => setActiveIndex(index)}>
                {carouselItems.map((item, index) => (
                    <Box
                    key={index} sx={{
    position: "relative",
    textAlign: "center",
    justifyContent: "center",
    color: "#fff",
    backgroundImage: "url('/images/dark-wood.jpg')",  // wooden background
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}>
                        <img src={item.image} alt={item.title}
                         style={{
      width: "100%",
      height: "70vh",
      minHeight: "400px",
      objectFit: "cover", // use contain for full for future references
    }} 
                        />
                        
                            
                        

                    <Box sx={{
      position: "absolute",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "10px 20px",
      borderRadius: 1,
    }}>
                        <Typography variant="h5" sx={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }} >{item.title}</Typography>
                        <Typography variant="body1" sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}>{item.description}</Typography>
                    </Box>
                    
                    </Box>
                ))}
                </SwipeableViews>
                {/* navigation button */}
                <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', zIndex: 2 }}>
                    <Button sx={{
            minWidth: "45px",
            height: "45px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 215, 0, 0.8)",
              color: "#000",
            },
          }} onClick={handleBack}>
                        <ArrowBackIosIcon />
                    </Button>
                    </Box>
                    <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
                    <Button sx={{
            minWidth: "45px",
            height: "45px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 215, 0, 0.8)",
              color: "#000",
            },
          }} onClick={handleNext}>
                        <ArrowForwardIosIcon />
                    </Button>
                    </Box>
                    </Box>
    );
};