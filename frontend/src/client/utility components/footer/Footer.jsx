
import { Box, Typography } from '@mui/material'
export default function Footer()

{
    return(
        <>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:1}} component={'div'}>

            <Typography variant='h6'>
                School Management System
            </Typography>

            <Typography variant='p'>
                All rights reserved &copy; Copyright@2025
            </Typography>

        </Box>
        </>
    )
}