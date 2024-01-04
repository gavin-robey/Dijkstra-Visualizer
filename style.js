import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "rgb(234, 234, 234)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    title : {
        fontSize: 40,
        margin: 30,
    },
    gridContainer: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default styles
