import { Box } from "@mui/material";

function ResponsiveBox() {
  return (
    <Box
      sx={{
        width: { xs: '100%', md:'50%', lg: '25%' },
        p: 2,
        bgcolor: 'primary.main'
      }}
    >
      Responsive Box
    </Box>
  );
}

export default ResponsiveBox;
