import React, { createContext, useState, useEffect } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';
import { Platform } from 'react-native';

type ProductsContextProps = {
    products:  Producto[];
    loadProducts: () => Promise<any>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>;
}


export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (): Promise<any> => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);

        return resp;
    };

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        // try {
            const resp = await cafeApi.post<Producto>('/productos', {
                nombre: productName,
                categoria: categoryId,
            });
            setProducts([...products, resp.data]);

            return resp.data;
        // } catch (error) {
        //     console.log(error);
        // }
    };
    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        try {
            const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
                nombre: productName,
                categoria: categoryId,
            });
            setProducts(products.map(prod => {
                return (prod._id === productId) ? resp.data : prod;
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (id: string) => {

    };
    const loadProductById = async (id: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${id}`);
        return resp.data;
    };

    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        const params = {
            name: data.assets![0].fileName!,
            type: data.assets![0].type!,
            uri: Platform.OS === 'ios' ? data.assets![0].uri!.replace('file://', '') : data.assets![0].uri!,
          };

        const fileToUpload = JSON.parse(JSON.stringify(params));
        // const fileToUpload  = {
        //     uri: data.assets?.[0].uri,
        //     type: data.assets?.[0].type,
        //     name: data.assets?.[0].fileName,
        // };

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(resp);
        } catch (error) {
            console.log({error});
        }
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                loadProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                loadProductById,
                uploadImage,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};
