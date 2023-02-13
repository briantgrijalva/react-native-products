import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { Producto } from '../interfaces/appInterfaces';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'>{}

export const ProductsScreen = ({ navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: touchableButton,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const touchableButton = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ marginRight: 20 }}
                onPress={() => navigation.navigate('ProductScreen', {})}
            >
                <Text>Agregar</Text>
            </TouchableOpacity>
        );
    };


    const renderSeparator = () => {
        return (
            <View style={styles.itemSeparator}/>
        );
    };

    const renderItem = (item: Producto) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProductScreen', {
                    id: item._id,
                    name: item.nombre,
                })}
            >
                <Text style={styles.productName}>{item.nombre}</Text>
            </TouchableOpacity>
        );
    };

    const loadProductsFromBackend = async() => {
        setRefreshing(true);
        const resp = await loadProducts();
        // console.log(resp.status);
        if (resp.status === 200) {
            setRefreshing(false);
        }
    };

    // const onRefresh = () => {
    //     loadProductsFromBackend();
    // };



    return (
        <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
                flex: 1,
                marginHorizontal: 10,
            }}
        >
            <FlatList
                data={products}
                keyExtractor={ (p) => p._id}
                renderItem={ ({item}) => renderItem(item)}
                ItemSeparatorComponent={renderSeparator}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadProductsFromBackend} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
    },
    itemSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 5,
    },
});
