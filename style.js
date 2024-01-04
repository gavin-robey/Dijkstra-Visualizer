import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "rgba(223, 224, 225)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    text : {
        fontSize: 50,
        color: 'black',
    },
    horizontal : {
        padding : 10,
        flexDirection: 'row',
        backgroundColor: "white",
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        width: '50%'
    },
    spacer : {
        height: 50
    }, 
    card: {
        backgroundColor: 'white',
        width : "95%",
        borderRadius: 10,
        padding: 16,
        margin: 8,
        elevation: 10,
    },
    index: {
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'black',
        padding: 4,
        borderRadius: 4,
    },
    scroller: {
        width : "100%"
    },
})

export default styles
