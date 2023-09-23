
//Get home page
exports.homepage = async (req , res) =>{
    const locals = {
        title : "GYM",
        description : "Free GYM App"
    }
    res.render("index" ,
     {
        locals ,
        // layout : "../views/layouts/front-page"
    });
};


// Get About page
exports.about = async (req , res) =>{
    const locals = {
        title : " About Gym",
        description : "Free Gym App"
    }
    res.render("about" , locals);
};