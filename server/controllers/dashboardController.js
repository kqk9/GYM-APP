const UserExercise  = require("../models/Exercises");
const mongoose = require("mongoose");



const today = new Date();
const dayOfWeek = today.getDay();
const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const currentDay = daysOfWeek[dayOfWeek];


let selectedDay ;
// Get dashboard page
exports.dashboard = async (req, res) => {
    const day = req.query.day || currentDay;
    selectedDay = day;
    const locals = {
        title: "Dashboard",
        description: "Free GYM App",
        day: day, 
    };

    UserExercise.findOne({ user: req.user.id }) 
        .then(user => {
            if (!user) {
                if (! user) {
                    user = new UserExercise({
                        user: req.user.id,
                        week: {
                            sunday: [],
                            monday: [],
                            tuesday: [],
                            wednesday: [],
                            thursday: [],
                            friday: [],
                            saturday: [],
                        }
                    });
                }
            }
        
            res.render('dashboard/index',
             {
                locals ,
                user ,
                layout : "../views/layouts/dashboard" ,
                name:req.user.firstName
            });  
        })
        .catch(error => {
            console.error('An error occurred while searching for the user:', error);
            res.redirect("/"); 
        });
}

// Get add page
exports.addPage = async (req,res)=>{
    const locals = {
        title: "Add",
        description: "Free GYM App",
        
    };
    res.render("dashboard/add" ,{layout : "../views/layouts/dashboard" ,locals, day : selectedDay});
}
// Add new 
exports.add = async (req, res) => {
    console.log(req.body);
    const dayToAddExerciseTo = req.body.day;

    const newExercise = {
        name: req.body.name,
        link: req.body.link,
    }
    const userId = req.user.id;
    UserExercise.findOne({ user: userId })
        .then(userExercise => {
            if (!userExercise) {
                userExercise = new UserExercise({
                    user: userId,
                    week: {
                        sunday: [],
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }
                });
            }

            // Ensure that the day of the week property exists before accessing it
            if (!userExercise.week || !userExercise.week[dayToAddExerciseTo]) {
                console.error('Day is unknown.');
                return res.redirect("/dashboard/add");
            }
            userExercise.week[dayToAddExerciseTo].push(newExercise);
            userExercise.save()
                .then(savedUserExercise => {
                    console.log('The exercise has been added successfully:', savedUserExercise);
                    res.redirect("/dashboard/add");
                })
                .catch(error => {
                    console.error('An error occurred while saving:', error);
                    res.redirect("/dashboard/add");
                });
        })
        .catch(error => {
            console.error('An error occurred while searching for the user:', error);
            res.redirect("/dashboard/add");
        });
}




//Delete
exports.delete = async (req, res) => {

    const dayToDeleteExerciseFrom = req.params.day; 
    const exerciseIdToDelete = req.params.id; 
    const userId = req.user.id;
    UserExercise.findOne({ user: userId })
        .then(userExercise => {
            if (!userExercise || !userExercise.week || !userExercise.week[dayToDeleteExerciseFrom]) {
                console.error('Day is unknown or has no exercises.');
                return res.redirect(`/dashboard?day=${dayToDeleteExerciseFrom}`);
            }

            // Find the exercise you want to delete using its ID
            const exerciseToDelete = userExercise.week[dayToDeleteExerciseFrom].find(exercise => exercise.id === exerciseIdToDelete);

            if (!exerciseToDelete) {
                console.error('Exercise is not exist.');
                return res.redirect(`/dashboard?day=${dayToDeleteExerciseFrom}`);
            }

            // Remove the exercise
            userExercise.week[dayToDeleteExerciseFrom] = userExercise.week[dayToDeleteExerciseFrom].filter(exercise => exercise.id !== exerciseIdToDelete);

            userExercise.save()
                .then(savedUserExercise => {
                    console.log('The exercise has been successfully deleted:', savedUserExercise);
                    res.redirect(`/dashboard?day=${dayToDeleteExerciseFrom}`);
                })
                .catch(error => {
                    console.error('An error occurred while deleting:', error);
                    res.redirect(`/dashboard?day=${dayToDeleteExerciseFrom}`);
                });
        })
        .catch(error => {
            console.error('An error occurred while searching for the user:', error);
            res.redirect(`/dashboard?day=${dayToDeleteExerciseFrom}`);
        });
}
