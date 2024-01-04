import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle } from 'react-native';

interface BoxProps {
    row: number;
    col: number;
    onVisited: boolean;
    onPathCreation: boolean;
    isBarrier: boolean; 
    isStart: boolean;
    isEnd: boolean;
    onClick: () => void;
}

const Box: React.FC<BoxProps> = ({ 
        onVisited,
        onPathCreation, 
        isBarrier, 
        isStart,
        isEnd,
        onClick 
    }) => {
    const backgroundColor = isStart ? '#a9e8cf' : isEnd ? '#FE998D' : isBarrier ? 'black' : onVisited ? 'lightblue' : onPathCreation ? '#3BB2E2' : '#fff';

    const boxStyle: ViewStyle = [
        styles.box,
        { backgroundColor },
    ];

    return (
        <TouchableOpacity onPress={onClick}>
            <View style={boxStyle} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        width: 40,
        height: 40,
        margin: 2,
        borderRadius: 5,
    },
});

export default Box;

