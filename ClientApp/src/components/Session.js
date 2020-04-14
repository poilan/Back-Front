import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";

const MainContainer = styled.div`
    display: table;
    height: 100%;
    width: 100%;
    left: 0;
    background: #E4E4E4;
    position: absolute;
`;

const Banner = styled.div`
    position: absolute;
    background: #4C7AD3;
    height: 75px;
    width: 100%;
    left: 0;
`;

const BannerArrow = styled.div`
    font-family: CircularStd;
    font-Size: 2rem;
    color: #fff;
    padding: 15px 0;
    margin-left: 10px;
    position: absolute;
    &:hover {
        cursor: pointer;
        margin-left: 7.5px;
    };
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1.5rem;
    color: #fff;
    padding: 25px 0;
    margin-left: 75px;
    position: absolute;
`;

const BannerCode = styled(BannerText)`
    width: 250px;
    left: 50%;
    margin-left: -125px;
`;

const BannerButton = styled(DropdownButton)`
    background: #fff;
    font-family: CircularStd;
    border-radius: 100px;
    color: #100E0E;
    font-weight: 450;
    text-align: center;
    position: absolute;
    top: 25%;
    left: 85%;
`;

const BodyContainer = styled(Card)`
    position: absolute;
    top: 75px;
    width: 100%;
    left: 0;
    height: calc(100vh - 75px);
`;

const CardHeader = styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 50px;
    top: 0;
    position: absolute;
`;

const HeaderTabs = styled(Nav)`
    left: 5%;
    position: absolute;
    height: 100%;
    top: 0;
    .nav-link {
        width: 175px;
        max-width: 33%;
        text-align: center;
        top: 0;
        height: 100%;
        color: black;
        padding: 15px;
        font-family: CircularStd;
        font-weight: 600;

        &:hover {
            border: 0;           
            background: #4C7AD3;
            padding-top: 12.5px;
        }

        &.active {
            border: 0;
            opacity: 100%;
            color: black;
            border-bottom: 4px solid #4C7AD3;
            cursor: default;
            background: #FFF;
            padding-top: 15px;
            
        };
    };
`;

const CardBody = styled(Card.Body)`
    background: #E4E4E4;
    position: absolute;
    top: 50px;
    width: 100%;
    min-height: calc(100vh - 126px);
`;

const SlidesOverview = styled.div`
    width: 20%;
    background: #fff;
    height: 85%;
    top: 7.5%;
    border-radius: 10px;
    display: inline-block;
    position: absolute;
    overflow: auto;
    left: 5%;
    padding: 0px 25px;

    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`; //Scrollbar only affects firefox currently

const SlideCategory = styled.div`
    border-radius: 20px;
    border: 2px solid black;
    margin-top: 5%;
    margin-bottom: 5%;
    position: relative;
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 600;
    padding: 10px;

    &:hover {
        cursor: pointer;
    };

`;

const NewSlide = styled(SlideCategory)`
    opacity: 50%;
    &:hover {
        opacity: 75%;
    };
`;

const SelectedSlide = styled(SlidesOverview)`
    left: 26%;
    width: 69%;
    padding: 0;
`;

const SlideTitle = styled.h1`
    position: absolute;
    width: 100%;
    font-family: CircularStd;
    text-align: center;
    top: 35%;
`;

const SlideBody = styled.h3`
    position: absolute;
    width: 100%;
    text-align: center;
    font-family: CircularStd;
    bottom: 25%;
`;

const QuestionContainer = styled.div`
    width: 100%;
    position: absolute;
    overflow: hidden;
    padding: 1% 5%;
    background: #E4E4E4;
    left: 0;
`;

const Overview = styled.h2`
    font-family: CircularStd;
    font-weight: 500;
    font-size: 1rem;
    margin: 1% 0;
    position: relative;
`;

const Question = styled.div`
    width: 100%;
    background: #fff;
    padding: 1.5% 2.5%;
    margin-bottom: 1%;
    border-radius: 10px;
    position: relative;
    font-family: CircularStd;
    font-weight: 420;    
    border: 1px solid black;
    opacity: 90%;

    &:hover {
        cursor:pointer;
        opacity: 100%;
    }
`;

const NewQuestion = styled(Question)`
    opacity: 50%;
    &:hover {
        opacity: 80%;
    }
`;

export class Session extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            code: 0,
            questions: [],
            question: 0,
            organizing: false,
        }

        this.selectTab = this.selectTab.bind(this);
        this.selectSlide = this.selectQuestion.bind(this);
        this.backToProjects = this.backToProjects.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
    }

    componentWillMount() {
        var code = sessionStorage.getItem("code");
        var title = sessionStorage.getItem("title");
        this.state.code = code;
        this.state.title = title;

        this.getQuestions();

    }

    async getQuestions() {
        const code = this.state.code;
        await axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({ questions: res.data });
            } else if (res.status === 404) {
                //session not found
            }
        })
    }

    async getSlides() { //Perhaps not needed
        const code = this.state.code;
        await axios.get(`admin/${code}/slides-all`).then(res => {
            if (res.status === 202) {
                this.setState({ slides: res.data });
            } else if (res.status === 404) {
                //session not found
            }
        })
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    selectQuestion(key) {
        this.setState({
            question: key,
        });
    }

    slidesTab() {
        //var slide = this.state.slides[this.state.slide],
        //question = this.state.questions[slide.questionIndex];

        return (
            <>
                <SlidesOverview>
                    {this.state.questions.map(question =>
                        <SlideCategory id={question.index} onSelect={this.selectQuestion}>{(question.Index + 1) + '. ' + question.title}</SlideCategory>)
                    }
                    <NewSlide>➕ Create new slide</NewSlide>
                </SlidesOverview>
                {this.activeSlide()}
            </>
        );
    }

    activeSlide() {
        var question = this.state.questions[this.state.question];

        if (question !== undefined && question.questionType === 0) {

        }
        else if (question !== undefined && question.questionType === 1) {

        }
        else {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there, I am the title</SlideTitle>
                    <SlideBody>As the body I just want to make it difficult</SlideBody>
                </SelectedSlide>
            );
        }
    }

    organizingTab() {
        if (this.state.questSelect) {
            return;
        } else {
            return (
                <QuestionContainer>
                    <Overview>Overview</Overview>
                    {this.state.questions.map(question =>
                        <Question id={question.index}>{question.index + 1}. {question.title}</Question>)}
                    <NewQuestion onClick={this.createQuestion}>➕ Create new question </NewQuestion>
                </QuestionContainer>
            );
        }
    }

    createQuestion() {
        this.props.history.go(-1);
    }

    backToProjects() {
        this.props.history.go(-1);
    }

    render() {
        return (
            <MainContainer>
                <Banner>
                    <BannerArrow onClick={this.backToProjects}>⟵</BannerArrow>
                    <BannerText>{this.state.title}</BannerText>
                    <BannerCode>{"#" + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3)}</BannerCode>
                    <BannerButton title="Presentation">
                        <Dropdown.Item disabled="true">Presentation mode</Dropdown.Item>
                        <Dropdown.Item disabled="true">Present in a new window</Dropdown.Item>
                        <Dropdown.Item disabled="true">Mirror Screen</Dropdown.Item>
                        <Dropdown.Item disabled="true">Get Presentation Link</Dropdown.Item>
                    </BannerButton>
                </Banner>
                <BodyContainer>
                    <Tab.Container defaultActiveKey="organize" onSelect={this.selectTab}>
                        <CardHeader>
                            <HeaderTabs variant="tabs">
                                <Nav.Link eventKey="slide">Slides</Nav.Link>
                                <Nav.Link eventKey="organize">Organizing</Nav.Link>
                                <Nav.Link eventKey="setting">Project Settings</Nav.Link>
                            </HeaderTabs>
                        </CardHeader>
                        <CardBody>
                            <Tab.Content>
                                <Tab.Pane eventKey="slide">
                                    {this.slidesTab()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="organize">
                                    {this.organizingTab()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="setting">
                                    <h1 style={{ fontSize: 900 }}>☣</h1>
                                </Tab.Pane>
                            </Tab.Content>
                        </CardBody>
                    </Tab.Container>
                </BodyContainer>
            </MainContainer>
        );
    }
}