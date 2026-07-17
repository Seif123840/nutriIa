package com.example.nutri.seed;

import com.example.nutri.entity.Food;
import com.example.nutri.entity.FoodLog;
import com.example.nutri.entity.User;
import com.example.nutri.repository.FoodLogRepository;
import com.example.nutri.repository.FoodRepository;
import com.example.nutri.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final FoodLogRepository foodLogRepository;

    private final Random random = new Random();


    private final String[] foodNames = {

            // Proteins
            "Chicken Breast",
            "Chicken Thigh",
            "Turkey Breast",
            "Beef Steak",
            "Ground Beef",
            "Salmon",
            "Tuna",
            "Shrimp",
            "White Fish",
            "Egg",
            "Egg White",

            // Dairy
            "Milk",
            "Greek Yogurt",
            "Cheese",
            "Cottage Cheese",
            "Butter",

            // Carbohydrates
            "White Rice",
            "Brown Rice",
            "Pasta",
            "Whole Wheat Pasta",
            "Bread",
            "Whole Wheat Bread",
            "Oats",
            "Quinoa",
            "Couscous",
            "Potato",
            "Sweet Potato",

            // Fruits
            "Banana",
            "Apple",
            "Orange",
            "Strawberry",
            "Blueberry",
            "Mango",
            "Pineapple",
            "Grapes",
            "Watermelon",
            "Avocado",

            // Vegetables
            "Broccoli",
            "Spinach",
            "Lettuce",
            "Tomato",
            "Carrot",
            "Cucumber",
            "Onion",
            "Pepper",
            "Mushroom",
            "Green Beans",

            // Nuts
            "Almonds",
            "Walnuts",
            "Peanuts",
            "Cashews",
            "Chia Seeds",
            "Flax Seeds",

            // Snacks
            "Protein Bar",
            "Dark Chocolate",
            "Peanut Butter",
            "Granola",

            // Drinks
            "Coffee",
            "Green Tea",
            "Orange Juice",
            "Protein Shake"
    };


    private final String[] meals = {
            "BREAKFAST",
            "LUNCH",
            "DINNER",
            "SNACK"
    };


    @Override
    public void run(String... args) {


        // éviter duplication
        if (foodRepository.count() > 0) {
            System.out.println("Food data already exists");
            return;
        }


        // =========================
        // CREATE FOOD DATA
        // =========================

        List<Food> foods = new ArrayList<>();

        for (String name : foodNames) {

            Food food = new Food();

            food.setDescription(name);
            food.setCategory("GENERAL");


            // Nutrition values per 100g
            food.setCalories(
                    50.0 + random.nextInt(400)
            );

            food.setProtein(
                    2.0 + random.nextDouble() * 35
            );

            food.setCarbohydrates(
                    5.0 + random.nextDouble() * 70
            );

            food.setFat(
                    1.0 + random.nextDouble() * 30
            );


            food.setFiber(2.0 + random.nextDouble() * 5);
            food.setSugar(1.0 + random.nextDouble() * 10);
            food.setSodium(50.0 + random.nextDouble() * 300);
            food.setPotassium(100.0 + random.nextDouble() * 500);
            food.setCalcium(50.0 + random.nextDouble() * 200);
            food.setIron(1.0 + random.nextDouble() * 10);


            foods.add(foodRepository.save(food));
        }


        System.out.println(
                foods.size() + " foods created"
        );



        // =========================
        // CREATE FOOD LOG DATA
        // =========================


        List<User> users = userRepository.findAll();


        if (users.isEmpty()) {

            System.out.println(
                    "No users found. Create users first."
            );

            return;
        }



        for (int i = 0; i < 1000; i++) {


            User user =
                    users.get(
                            random.nextInt(users.size())
                    );


            Food food =
                    foods.get(
                            random.nextInt(foods.size())
                    );


            double quantity =
                    50 + random.nextInt(450);



            FoodLog foodLog =
                    FoodLog.builder()

                            .user(user)

                            .food(food)

                            .mealType(
                                    meals[
                                            random.nextInt(
                                                    meals.length
                                            )
                                            ]
                            )


                            .quantityG(quantity)


                            // calculate nutrition based on quantity
                            .calories(
                                    food.getCalories()
                                            * quantity / 100
                            )


                            .proteinG(
                                    food.getProtein()
                                            * quantity / 100
                            )


                            .carbsG(
                                    food.getCarbohydrates()
                                            * quantity / 100
                            )


                            .fatG(
                                    food.getFat()
                                            * quantity / 100
                            )


                            .date(
                                    LocalDate.now()
                                            .minusDays(
                                                    random.nextInt(90)
                                            )
                            )


                            .build();



            foodLogRepository.save(foodLog);

        }


        System.out.println(
                "1000 FoodLogs created successfully"
        );

    }
}