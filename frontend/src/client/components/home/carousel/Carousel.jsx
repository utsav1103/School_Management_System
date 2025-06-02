import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import {Typography , Box, Button} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const carouselItems = [
    {
        image:'https://img.freepik.com/premium-vector/school-building-illustration_638438-385.jpg?semt=ais_items_boosted&w=740',
        title:'explore our classroom',
        description:'Engaging and Inspirational Learning Experiences',
    },
    {
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrN8ca7djoyClAewQL1_L0m1sBt17epMZdhKcOlHAO1LDjRTVII09yCco&s',
        title:'Empower Your Learning Journey',
        description:'We believe in the power of education.',
    },
    {
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJoG1Q6_u8PiLw1yt97JddGbDj0p0_gSGLAx9kunjJEhCFYhP3RTvkap4&s',
        title:'learning tools',
        description:'enthusiasm and creativity.',
    },
    {
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7zO4vaPxC6o93dwBFuzEeGWMAb_70zLs1wDfnhjNmagKFojAeVd_Iuf0&s',
        title:'great learning',
        description:'open your mind.',
    },
    {
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThwObAhjLQeIn8MWukad-2Zxx0_cnW-vD1KJF9_8e6FmVEnfmDlTNmY4U&s',
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
        <Box sx = {{ position:"relative",width:"100%" }}>
            <SwipeableViews 
            index={activeIndex} onChangeIndex={(index) => setActiveIndex(index)}>
                {carouselItems.map((item, index) => (
                    <Box
                    key={index} sx={{ position: 'relative', textAlign: 'center', justifyContent: 'center', color: '#fff' }}>
                        <img src={item.image} alt={item.title}
                        style={{ width: '100%', height: '70vh',minHeight: '400px', objectFit: 'cover' }} 
                        />
                        
                            
                        

                    <Box sx={{ position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // semi-transparent black background
        padding: '10px 20px',
        borderRadius: 1, }}>
                        <Typography variant="h5">{item.title}</Typography>
                        <Typography variant="body1">{item.description}</Typography>
                    </Box>
                    
                    </Box>
                ))}
                </SwipeableViews>
                {/* navigation button */}
                <Box sx={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
                    <Button variant="contained" onClick={handleBack}>
                        <ArrowBackIosIcon />
                    </Button>
                    </Box>
                    <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
                    <Button variant="contained" onClick={handleNext}>
                        <ArrowForwardIosIcon />
                    </Button>
                    </Box>
                    </Box>
    );
};