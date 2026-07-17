/*package com.example.nutri.service;

import com.example.nutri.entity.Food;
import com.example.nutri.entity.Nutrient;
import com.example.nutri.repository.FoodRepository;
import com.example.nutri.repository.NutrientRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final FoodRepository foodRepository;
    private final NutrientRepository nutrientRepository;

    // USDA Nutrient IDs
    private static final long PROTEIN = 1003;
    private static final long FAT = 1004;
    private static final long CARBS = 1005;
    private static final long ENERGY = 1008;
    private static final long FIBER = 1079;
    private static final long SUGAR = 2000;
    private static final long SODIUM = 1093;
    private static final long CALCIUM = 1087;
    private static final long IRON = 1089;
    private static final long POTASSIUM = 1092;

    @Transactional
    public void importFoods() {
        if (foodRepository.count() > 0) {
            System.out.println("Les aliments sont déjà importés.");
            return;
        }

        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("csv/food.csv");
             CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {

            if (inputStream == null) {
                System.out.println("food.csv introuvable");
                return;
            }

            // Ignorer l'en-tête
            reader.readNext();

            List<Food> foods = new ArrayList<>();
            String[] line;

            while ((line = reader.readNext()) != null) {
                Food food = new Food();
                food.setId(Long.parseLong(line[0]));
                food.setCategory(line[1]);
                food.setDescription(line[2]);
                foods.add(food);
            }

            foodRepository.saveAll(foods);
            System.out.println("Nombre d'aliments importés : " + foods.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void importNutrients() {
        if (nutrientRepository.count() > 0) {
            System.out.println("Nutriments déjà importés");
            return;
        }

        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("csv/nutrient.csv");
             CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {

            if (inputStream == null) {
                System.out.println("nutrient.csv introuvable");
                return;
            }

            reader.readNext();

            List<Nutrient> nutrients = new ArrayList<>();
            String[] line;

            while ((line = reader.readNext()) != null) {
                Nutrient nutrient = new Nutrient();
                nutrient.setId(Long.parseLong(line[0]));
                nutrient.setName(line[1]);
                nutrient.setUnitName(line[2]);
                nutrients.add(nutrient);
            }

            nutrientRepository.saveAll(nutrients);
            System.out.println("Nutriments importés : " + nutrients.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void importFoodNutrients() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("csv/food_nutrient.csv");
             CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {

            if (inputStream == null) {
                System.out.println("food_nutrient.csv introuvable");
                return;
            }

            // Ignorer l'en-tête
            reader.readNext();

            // 1. Charger tous les aliments existants en mémoire (Map<id, Food>)
            Map<Long, Food> foodMap = foodRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(Food::getId, f -> f));

            if (foodMap.isEmpty()) {
                System.out.println("Aucun aliment trouvé en base. Veuillez d'abord importer les aliments.");
                return;
            }

            // 2. Lire le CSV et collecter les mises à jour
            List<Food> foodsToUpdate = new ArrayList<>();
            String[] line;
            int count = 0;

            while ((line = reader.readNext()) != null) {
                Long foodId = Long.parseLong(line[1]);
                Long nutrientId = Long.parseLong(line[2]);
                Double amount = (line[3] != null && !line[3].isEmpty()) ? Double.parseDouble(line[3]) : 0.0;

                Food food = foodMap.get(foodId);
                if (food == null) continue;

                // Appliquer la valeur nutritionnelle selon l'ID du nutriment
                switch (nutrientId.intValue()) {
                    case 1003: food.setProtein(amount); break;
                    case 1004: food.setFat(amount); break;
                    case 1005: food.setCarbohydrates(amount); break;
                    case 1008: food.setCalories(amount); break;
                    case 1079: food.setFiber(amount); break;
                    case 2000: food.setSugar(amount); break;
                    case 1093: food.setSodium(amount); break;
                    case 1092: food.setPotassium(amount); break;
                    case 1087: food.setCalcium(amount); break;
                    case 1089: food.setIron(amount); break;
                    default: continue;
                }

                // Ajouter à la liste des aliments modifiés
                foodsToUpdate.add(food);
                count++;
            }

            // 3. Sauvegarder en batch
            if (!foodsToUpdate.isEmpty()) {
                foodRepository.saveAll(foodsToUpdate);
            }

            System.out.println("Nutriments des aliments mis à jour : " + count);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
} */