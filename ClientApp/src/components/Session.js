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
`;

const HeaderTabs = styled(Nav)`
    left: 5%;
    position: absolute;
    .nav-link {
        width: 175px;
        max-width: 33%;
        text-align: center;
        color: black;
        padding: 5px;
        font-family: CircularStd;
        font-weight: 600;

        &.active {
            border: 0;
            border-bottom: 4px solid #4C7AD3;
        };
    };
`;

const CardBody = styled(Card.Body)`
    background: #E4E4E4;
`;

const SlidesOverview = styled.div`
    width: 20%;
    background: #fff;
    height: 85%;
    top: 7.5%;
    border-radius: 10px;
    display: inline-block;
    position: absolute;
    left: 5%;
    padding: 40px 25px;
`;

const SlideCategory = styled.div`
    border-radius: 20px;
    border: 2px solid black;
    position: relative;
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 600;
    padding: 10px;

`;

const NewSlide = styled(SlideCategory)`
    opacity: 50%;
    &:hover {
        cursor: pointer;
    };
`;

const SelectedSlide = styled(SlidesOverview)`
    left: 26%;
    width: 69%;
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

    &:hover {
        cursor:pointer;
    }
`;

export class Session extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            code: '',
            slides: [],
            slide: 0,
            questions: [],
            question: 0,
            questSelect: false,
        }

        this.selectTab = this.selectTab.bind(this);
        this.selectSlide = this.selectSlide.bind(this);
    }

    componentWillMount() {
        var code = sessionStorage.getItem("code");
        var title = sessionStorage.getItem("title");
        this.setState({
            code: code,
            title: title,
        })
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    selectSlide(key) {
        this.setState({
            slide: key,
        });
    }

    slidesTab() {
        //var slide = this.state.slides[this.state.slide],
        //question = this.state.questions[slide.questionIndex];

        return (
            <>
                <SlidesOverview>
                    {//this.state.slides.map(slide =>
                        //<SlideCategory key="slide.index" onSelect={this.selectSlide}>{slide.index + '. ' + slide.title}</SlideCategory>)
                    }
                    <NewSlide>➕ Create new slide</NewSlide>
                </SlidesOverview>
                <SelectedSlide>
                    <SlideBody>
                        And as the body I just wanted to say fuck you and hope I make it difficult!
                    </SlideBody>
                    <SlideTitle>
                        Hello there, I am the title.
                    </SlideTitle>
                </SelectedSlide>
            </>
        );
    }

    organizingTab() {
        if (this.state.questSelect) {
            return;
        } else {
            return (
                <QuestionContainer>
                    <Overview>Overview</Overview>
                    {//this.state.questions.map(question =>
                        //<Question>{question.index + 1}. {question.title}</Question>)
                    }
                    <Question>1. What type of animal is the most versatile?</Question>
                    <Question>2. Which animals belong to that group?</Question>
                    <Question>3. Which of these animals could take on all the other options in a fight?</Question>
                </QuestionContainer>
            );
        }
    }

    render() {
        return (
            <MainContainer>
                <Banner>
                    <BannerArrow>⟵</BannerArrow>
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