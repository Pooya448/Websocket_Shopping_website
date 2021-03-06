import logo from './logo.svg';
import react, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Button } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import zlib from 'react-zlib-js';
import pako from 'pako';
import urlsafe_b64 from 'urlsafe-base64';
import { encode, decode, Base64 } from 'js-base64';


class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
        products: [],
        cart: [],
        endpoint: "http://127.0.0.1:5000"
        }
        this.socket = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        
    }
    
    
    componentDidMount() {
        console.log('I was triggered during componentDidMount')
        const { endpoint } = this.state;
        
        fetch('http://127.0.0.1:5000/shop/',{method: 'GET',
            credentials: "include"})
        .then(response => response.json())
        .then(data => {
            this.setState({products : data})
            console.log("FUCKING HTTP");
            console.log('products');
            console.log(this.state.products);
            console.log('data');
            console.log(data);
        });
        this.socket = io(this.state.endpoint);
        
        
        console.log("coooooookie");
        let data = Cookies.get('session');
//        console.log(data);
//        var compressed = false;
//        if (data){
//            if (data.substring(0, 1) == "."){
//                compressed = true;
//                data = data.slice(1);
//                console.log("SLiced");
//                console.log(data);
//            }
//            data = data.split(".")[0];
//            data = urlsafe_b64.decode(data);
//            console.log(data);
//            if (compressed){
//                data = pako.inflate(data, { to: 'string' });
//            }
//            data = JSON.parse(data);
//            console.log(data);
//            console.log("done");
//            console.log(data.cart);
//            this.setState({cart: data.cart})
//        }
        if(data){
        this.socket.emit("get-cart", {owner: data}, function(idp){
            console.log("sadsadfdfskklndkasflslkdd");
            console.log(data);
        });
        
        
        if(this.socket){
        this.socket.on("update_prod",(data) => {
            this.setState({products: data})
            console.log(this.state.products);
        });
        
        this.socket.on("update_cart",(data) => {
            this.setState({cart: data})
            console.log(this.state.products);
        });
        }
    }
    }
    
    handleClick(e,idprod) {
        e.preventDefault();
        let data = Cookies.get('session');
        if(data){
        this.socket.emit("added-to-cart", {owner: data, id : idprod}, function(idp){
            console.log("sadsad add aadd ad add");
            console.log(idprod);
            console.log(data);
        });
        }
    }
    
    handleClickRemove(e,idprod) {
        e.preventDefault();
        let data = Cookies.get('session');
        if(data){
        this.socket.emit("removed-from-cart", {owner: data, id : idprod}, function(idps){
            console.log(idprod);
        });
        }
    }
    
    handleClickCheckout(e) {
        e.preventDefault();
        let data = Cookies.get('session');
        if(data){
        this.socket.emit("checkout", {owner: data}, function(idp){
            console.log("checkout");
            console.log(data);
        });
        }
    }
    
    renderTableDataProducts(where) {
        return where.map((student, index) => {
            const { id, name, price, quantity } = student //destructuring
            return (
                    <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{price}</td>
                    <td>{quantity}</td>
                    <td><button key={id} width='50px' height='50px' onClick={(e) => this.handleClick(e,id)}>Add</button></td>
                    </tr>
                    )
        })
    }
    
    renderTableDataCart(where) {
        if (where){
            if(where[0]){
                let header = Object.keys(where[0]);
                var f = where[0];
                return where.map((key, index) => {
                    const { id, name, price, quantity } = key; //destructuring
                    var ref_tag = `${id}_remove`;
                    return (
                            <tr key={id}>
                            <td>{id}</td>
                            <td>{name}</td>
                            <td>{price}</td>
                            <td><button key={id} width='50px' height='50px' onClick={(e) => this.handleClickRemove(e,id)}>Remove</button></td>
                            </tr>
                            )
                })
            }
        }
    }
    
    renderTableHeaderCart(where) {
        if(where[0]){
            let header = Object.keys(where[0]);
            header.pop();
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }
    }
    
    renderTableHeader(where) {
        if(where[0]){
            let header = Object.keys(where[0])
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }
    }
    
    render() {
        return (
                <div>
                <h1 id='title'>Products List</h1>
                <table id='students'>
                <tbody>
                <tr>{this.renderTableHeader(this.state.products)}</tr>
                {this.renderTableDataProducts(this.state.products)}
                </tbody>
                </table>
                
                <h1 id='title'>Shopping Cart</h1>
                <table id='students'>
                <tbody>
                <tr>{this.renderTableHeaderCart(this.state.cart)}</tr>
                {this.renderTableDataCart(this.state.cart)}
                </tbody>
                </table>
                <button key="checkout" width='50px' height='50px' onClick={(e) => this.handleClickCheckout(e)}>Checkout</button>
                </div>
                )
    }
}

ReactDOM.render(<table />, document.getElementById('root'));
                export default App;
