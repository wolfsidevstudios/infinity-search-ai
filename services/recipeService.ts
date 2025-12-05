
export interface Recipe {
  id: string;
  title: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  ingredients: { name: string; measure: string }[];
  sourceUrl: string;
  youtubeUrl: string;
}

const mapMealToRecipe = (meal: any): Recipe => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || ''
      });
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    thumbnail: meal.strMealThumb,
    ingredients,
    sourceUrl: meal.strSource,
    youtubeUrl: meal.strYoutube
  };
};

export const fetchRandomRecipes = async (count: number = 3): Promise<Recipe[]> => {
  try {
    const promises = Array.from({ length: count }).map(() => 
      fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
    );

    const results = await Promise.all(promises);
    return results
      .map(data => data.meals ? mapMealToRecipe(data.meals[0]) : null)
      .filter((r): r is Recipe => r !== null);
  } catch (error) {
    console.error("Recipe API Error:", error);
    return [];
  }
};
