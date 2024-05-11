import axios from "axios";

import type { Category } from "../types";

export async function getCategories(userID:number):Promise<Category[]>{
    const categories = await axios.get(`${process.env.REACT_APP_API_ROOT}categories/get-categories`, {
        params:{
            user_id: userID,
            columns: JSON.stringify(["category_id", "name"])
        }
    })
    .then((response) => {
        const categories = response.data.categories;
        
        return categories
    })
    .catch((error) => {
        console.log(error);
    });

    return categories
}