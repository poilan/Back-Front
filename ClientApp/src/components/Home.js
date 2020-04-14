import React, { Component } from 'react';
import axios from "axios";
import styled from "styled-components";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import "circular-std";

const LeftHalf = styled(Col)`
  background: #4C7AD3;
  position: absolute;
  left: 0;
  width: ${props => props.mobile === "true" ? "100%" : "40%"};
  height: 100%;
  padding: 0px;
`;

const LeftInput = styled.input`
    height: 7.5%;
    width: 40%;
    margin: 0 30%;

    background-color: white;
    color: black;
    border: 0px solid;
    border-radius: 10px;
    padding: 3px;
    text-align: center;
    font-family: CircularStd;
    font-size: 150%;

    &::placeholder {
      position: relative;
      margin: auto;
      left: 30px;
    }
`;

const LeftText = styled.h1`
    color: #fff;
    width: 100%;
    margin: 30% auto 0 auto;
    font-family: CircularStd;
    font-weight: bold;
    font-size: 2.5rem;
    line-height: 150%;
    text-align: center;
    padding: 10px;
`;

const LeftTitle = styled.h2`
    color: #fff;
    opacity: 45%;
    margin: 0 auto;
    font-family: CircularStd;
    font-size: 1rem;
    padding: 50px;

`;

const RightHalf = styled(Col)`
  display: ${props => props.mobile === "true" ? "none" : "block"};
  position: absolute;
  top: 0px;
  left: 40%;
  width: 60%;
  height: 100%;
  margin-left: 0px;
  padding: 0px;
`;

const RightNav = styled(Nav)`
    .nav-link {
        &.active {
            color: rgb(71, 114, 224);
        }
        align: right;
        font-weight: 500;
        font-family: CircularStd;
        padding: 10px 25px;
        bottom: 100px;
        right: 100px;
        position: relative;

        color: black;
    };
`;

const RightTitle = styled.h2`
    color: #100e0e;
    opacity: 25%;
    padding: 50px;
    font-family: CircularStd;
    font-size: 1rem;

`;

const LandingContainer = styled(Container)`
  display: table;
  height: 100%;
  width: 100%;
`;

const LoginButton = styled(Nav.Link)`
    border: 2px solid black;
    border-radius: 10px;
    text-align: center;
    width: 150%;
`;

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            width: window.innerWidth,

            loggedIn: false,
        };
    }

    componentWillMount() {
        if (localStorage.getItem("user") !== null)
            this.setState({
                loggedIn: true
            });
    }

    async connectToSession(e) {
        e.preventDefault();
        let api = process.env.REACT_APP_API_URL;

        let code = e.target.value;
        this.state.code = code;

        await axios.get(`${api}client/code-${code}`).then(res => {
            const result = res.data;

            if (result === true) {
                sessionStorage.setItem("code", code);
            } else {
                //Tell the user this code didn't work
            }
        })
    }

    rightNav() {
        return (
            <RightNav className="justify-content-end" activeKey="/">
                <Nav.Item>
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/help">Help</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/contact">Contact</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    {this.state.loggedIn ? <LoginButton href="/dashboard">Get Started</LoginButton> : <LoginButton href="/Login">Login</LoginButton>}
                </Nav.Item>
            </RightNav>
        );
    }

    render() {
        return (
            <LandingContainer>
                <LeftHalf>
                    <LeftTitle id="ParticipantText">Participant</LeftTitle>
                    <LeftText id="JoinText">Join a presentation</LeftText>
                    <LeftInput placeholder="Enter the 6-digit code..." name="code" onsubmit={this.connectToSession} />
                </LeftHalf>

                <RightHalf>
                    <RightTitle id="AdminText">Admin</RightTitle>
                    {this.rightNav()}
                </RightHalf>
            </LandingContainer>
        );
    }
}