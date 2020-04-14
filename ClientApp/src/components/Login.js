import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Card, Form, InputGroup, Nav, Tab, Button } from 'react-bootstrap';

const LoginContainer = styled.div`
   display: table;
   width: 100%;
   height: 100%;
`;

const LoginCard = styled(Card)`
    position: absolute;
    width: 30%;
    height: 90%;
    left: 35%;
    top: 5%;
`;

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'login',
            login: {
                email: '',
                password: '',
                validated: false,
            },

            register: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                repeatPassword: '',
                validated: false,
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegistration = this.submitRegistration.bind(this);
        this.selectTab = this.selectTab.bind(this);
    }

    handleChange(e) {
        const tab = this.state.tab;
        const name = e.target.name;
        const value = e.target.value;

        const data = this.state[tab];
        data[name] = value;
        data.validated = false;

        this.setState({
            [tab]: data,
        });
    }

    loginTab() {
        return (
            <>
                <Form autoComplete="on" validated={this.state.login.validated} onSubmit={this.submitLogin}>
                    <Form.Group controlId="validateUser">
                        <InputGroup>
                            <Form.Control name="email" onChange={this.handleChange} placeholder="Email address..." type="email" required />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="validatePass">
                        <InputGroup>
                            <Form.Control autoComplete="off" name="password" onChange={this.handleChange} placeholder="Password..." type="password" minLength="8" required />
                        </InputGroup>
                    </Form.Group>
                    <Button type="submit">Login</Button>
                </Form>
            </>
        );
    }

    async submitLogin(event) {
        event.preventDefault();

        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        const data = {
            Email: this.state.login.email,
            Password: this.state.login.password,
        }

        await axios.get(`user/login`, data
        ).then(res => {
            if (res.data === true) {
                //Login Success
                localStorage.setItem("user", data.Email);
                this.props.history.go(-1);
            } else {
                //Failed to log in
            }
        });
    }

    registerTab() {
        return (
            <>
                <Form autoComplete="on" noValidate validated={this.state.register.validated} onSubmit={this.submitRegistration}>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="firstName" onChange={this.handleChange} placeholder="First name..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="lastName" onChange={this.handleChange} placeholder="Last name..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="email" onChange={this.handleChange} placeholder="Email.." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="password" onChange={this.handleChange} placeholder="Password..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="repeatPassword" onChange={this.handleChange} placeholder="Repeat password..." />
                        </InputGroup>
                    </Form.Group>
                    <Button type="submit">Register</Button>
                </Form>
            </>
        );
    }

    async submitRegistration(event) {
        event.preventDefault();
        const data = this.state.register;

        await axios.post(`user/register`, data).then(res => {
            if (res.status === 202) {
                //Registration Succeeded
                //Redirect to log in?
            }
            else if (res.status === 406) {
                //User didn't write in a correct email address
                //or password was too short (needs to be 8 or more characters)
            }
            else if (res.status === 409) {
                //That email is already in use
            }
            else if (res.status === 400) {
                //Data wasn't recieved by server
            }
        });
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    render() {
        return (
            <LoginContainer>
                <LoginCard>
                    <Tab.Container defaultActiveKey="login" onSelect={this.selectTab}>
                        <Card.Header>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="login">Login</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="register">Register</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="login">
                                    {this.loginTab()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="register">
                                    {this.registerTab()}
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </Tab.Container>
                </LoginCard>
            </LoginContainer>
        );
    }
}