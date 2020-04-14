import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";

const MainContainer = styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
`;

const Banner = styled(Col)`
    position: absolute;
    background: #4C7AD3;
    height: 75px;
    left: 0;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 2rem;
    color: #fff;
    padding: 20px 50px;
    position: absolute;
`;

const BannerButton = styled(Nav.Link)`
    background: #fff;
    font-family: CircularStd;
    border-radius: 100px;
    color: #100E0E;
    font-weight: 450;
    text-align: center;
    width: 200px;
    position: absolute;
    top: 25%;
    left: 65%;
`;

const Header = styled(Col)`
    background: #fff;
    position: absolute;
    height: 50px;
    left: 0;
    top: 75px;
`;

const HeaderText = styled.h1`
    font-family: CircularStd;
    font-weight: 425;
    padding: 10px 35px;
    font-size: 1rem;
    border-bottom: 4px solid #4C7AD3;
    position: absolute;
    width: 140px;
    left: 100px;
    top: 10px;
`;

const ProjectContainer = styled(Col)`
    position: absolute;
    background: #E4E4E4;
    min-height: calc(100vh - 130px);
    left: 0;
    top: 130px;
`;

const ProjectText = styled.h1`
    position: absolute;
    width: 95%;
    text-align: center;
    top: 30%;
    font-family: CircularStd;
    font-size: 2rem;
    font-weight: 400;
`;

const ProjectButton = styled(BannerButton)`
    color: #fff;
    background: #4C7AD3;
    top: 40%;
    left: 45%;
`;

const CategoryContainer = styled(Col)`
    position: absolute;
    top: 125px;
    width: 100%;
    left: 0:
`;

const Category = styled.div`
    background: #fff;
    width: 70%;
    margin-top: 20px;
    margin-left: 15%;
    border-radius: 10px;
    height: 75px;
    position: relative;
`;

const CategoryTitle = styled.h3`
    font-size: 15px;
    position: relative;
    padding: 30px 0;
    margin-left: 3%;
    font-family: CircularStd;
    font-weight: 500;
    display: inline-block;
    flex-direction: row;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 25%;
`;

const CategoryIdentity = styled(CategoryTitle)`
    color: #A4A4A4;
`;

const CategoryTime = styled(CategoryIdentity)`
    float: right;
    text-align: right;
`;

const CategorySettings = styled(CategoryTitle)`
    float: right;
    text-align: right;
    margin-right: 3%;
`;

const ProjectModal = styled.div`
    position: fixed;
    z-index: 1;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ProjectModalContent = styled.div`
    background-color: #fff;
    position: absolute;
    top: 30%;
    left: 40%;
    padding: 30px;
    border-radius: 10px;
`;

const PopupText = styled.h3`
    font-family: CircularStd;
    font-size: 0.8rem;
    padding: 10px;
    color: #100e0e;
    opacity: 50%;
`;

const CancelButton = styled(ProjectButton)`
    color: #100e0e;
    background: #fff;
    position: relative;
    left: 5%;
`;

const CreateButton = styled(ProjectButton)`
    position: relative;
    left: 5%;
`;

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            showModal: false,
            title: '',
        }
        this.createProject = this.createProject.bind(this);
        this.newProject = this.newProject.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sessionClick = this.sessionClick.bind(this);
    }

    componentWillMount() {
        this.getSessions();
    }

    async getSessions() {
        let email = localStorage.getItem("user");
        await axios.get(`admin/sessions-${email}`).then((response) => {
            this.setState({ sessions: response.data });
        });
    }

    newProject() {
        this.setState({
            showModal: true,
        });
    }

    createProject(event) {
        event.preventDefault();
        this.closeModal();

        let data = {
            Title: this.state.title,
            Owner: localStorage.getItem('user'),
        }

        axios.post(`admin/create`, data).then(res => {
            if (res.status === 202) {
                //Created Session
                this.getSessions();
            }
            else if (res.status === 406) {
                //Title can't be empty!
            }
        });
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({
            [name]: value,
        });
    }

    sessionClick(e) {
        console.log(e);
        axios.post(`admin/load-${e.id}`).then(res => {
            if (res.status === 200) {
                //Session already active?
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute('name'));
                this.props.history.push('/session');
            }
            else if (res.status === 201) {
                //Session Created!
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute('name'));
                this.props.history.push('/session');
            }
            else if (res.status === 404) {
                //Session not found
            }
            else {
                //Unknown error
            }
        })
    }

    sessionRender() {
        if (this.state.sessions && this.state.sessions.length) {
            return (
                this.state.sessions.map(session =>
                    <Category id={session.identity} name={session.title} key={session.identity} onClick={((e) => this.sessionClick(e.target))}>
                        <CategoryTitle>{session.title}</CategoryTitle>
                        <CategoryIdentity>#{session.identity}</CategoryIdentity>
                        <CategorySettings>...</CategorySettings>
                        <CategoryTime>{this.displayDate(session.lastOpen)}</CategoryTime>
                    </Category>)
            );
        } else {
            return (
                <ProjectContainer>
                    <ProjectText>We didn't find any projects here, create your first now!</ProjectText>
                    <ProjectButton onClick={this.newProject}>New project</ProjectButton>
                </ProjectContainer>
            );
        }
    }

    displayDate(dateTime) {
        var date = new Date(Date.parse(dateTime));
        var month = '';
        switch (date.getMonth() + 1) {
            case 1:
                month = 'January';
                break;
            case 2:
                month = 'Febuary';
                break;
            case 3:
                month = 'March';
                break;
            case 4:
                month = 'April';
                break;
            case 5:
                month = 'May';
                break;
            case 6:
                month = 'June';
                break;
            case 7:
                month = 'July';
                break;
            case 8:
                month = 'August';
                break;
            case 9:
                month = 'September';
                break;
            case 10:
                month = 'October';
                break;
            case 11:
                month = 'November';
                break;
            case 12:
                month = 'December'
                break;
        }

        return `${date.getUTCDate()}. ${month} ${date.getFullYear()}`;
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <>
                <MainContainer>
                    <Banner>
                        <BannerText>Slagkraft</BannerText>
                        <BannerButton onClick={this.newProject}>New project</BannerButton>
                    </Banner>
                    <Header>
                        <HeaderText>Overview</HeaderText>
                    </Header>
                    <CategoryContainer>
                        {this.sessionRender()}
                    </CategoryContainer>
                </MainContainer>
                <ProjectModal style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <ProjectModalContent>
                        <Form autoComplete="on" onSubmit={this.createProject}>
                            <PopupText>Title</PopupText>
                            <Form.Group controlId="validateTitle">
                                <InputGroup>
                                    <Form.Control name="title" onChange={this.handleChange} placeholder="Project title..." required />
                                </InputGroup>
                            </Form.Group>
                            <CreateButton onClick={this.createProject}>Create project</CreateButton>
                            <CancelButton onClick={this.closeModal}>Cancel</CancelButton>
                        </Form>
                    </ProjectModalContent>
                </ProjectModal>
            </>
        );
    }
}