import React from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { generatePair, read, encrypt, decrypt } from './Crypto'
import { get, post } from './HttpCalls'

export default class Test extends React.Component{
    constructor(){
        super();
        this.state = {
            text: "Sample Text",
            getResponse: "no res",
            postResponse: "no res",
            encrytedMessage: null,
            decryptedMessage: null,
            privateKey: null,
        }
            
        
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        generatePair();
        read('privateKey').then( key => {
            this.setState({privateKey: key})
        });
        
            


        console.log("here")
        get("get?foo1=bar1&foo2=bar2").then(res => {
            console.log("h: "+ res)
            this.setState({
                getResponse: res,
            })
        }).catch(error => {
            console.log(error)
        })

        post("post", "bunch of info", null).then(res => {
            console.log("r: "+ res)
            this.setState({
                postResponse: res,
            })
        }).catch(error => {
            console.log(error)
        })
    }

    handleChange(e){
        this.setState({
            text: e,
        })
    }

    onClick() {
        console.log(this.state.text)
        encrypt(this.state.text).then(myMessage =>{
            console.log("EEHEH " + myMessage)
            this.setState({
                encrytedMessage: myMessage
            })
        })
        .then(decrypt(this.state.encrytedMessage)
        .then(unencrypted => {
            this.setState({
                decryptedMessage: unencrypted
            })
        })).catch(error => {
            console.log(error)
        })
        
    }
    render(){
        return (
            <View style={styles.container}>
                <Text>Should be working</Text>
                <Text>Encrypted message: {this.state.encrytedMessage}</Text>
                <Text>Decrypted message: {this.state.decryptedMessage}</Text>
                <TextInput value={this.state.text} onChangeText={this.handleChange} style={styles.body}/>
                <Button title="Create" onPress={this.onClick}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      backgroundColor: 'red',
      padding: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    body: {
        backgroundColor: 'yellow',
        padding: 20,
    },
    private: {
      backgroundColor: 'blue',
      padding: 20,
  },
    buttonContainer: {
        marginTop: 20,
    }
  });