import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { User } from "../types/User";
import { UserLogin } from "../types/UserLogin";
import api, {logOut, saveToken, saveUser} from "../api/api";
import { ApiResponse } from "../types/ApiResponse";

interface LoginComponentProps {
    isLoggedInFunc: (loggedIn: boolean) => void
}
interface LoginComponentState {
    login: UserLogin;
    isLoggedIn: boolean;
    user?: User;
    errorMessage: string;
    validated: boolean;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {

    constructor(props: LoginComponentProps) {
        super(props);
        this.state = {
            login: new UserLogin(),
            isLoggedIn: false,
            errorMessage: "",
            validated: false,
        };
        logOut();
        props.isLoggedInFunc(false); // odjavi korisnika
    }

    render() {
        console.log('render**********' + this.state.isLoggedIn);

        if (this.state.isLoggedIn === true) {
            console.log('redirect');
            return <Redirect to="/"></Redirect>;
        }
        return (
            <Container>
                <Alert
                    variant="danger"
                    className={this.state.errorMessage ? "" : "d-none"}
                >
                    {this.state.errorMessage}
                </Alert>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.handleSubmit}
                >
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={this.state.login.email}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
            </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            id="password"
                            value={this.state.login.password}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Prijava
                    </Button>
                </Form>
            </Container>
        );
    }

    handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidate(true);
            return;
        }

        api("/login", "post", {
            email: this.state.login.email,
            password: this.state.login.password,
        }).then((res: ApiResponse) => {
            if (res.status === "error") {
                console.log("********************************")
                console.log(res);
                this.setErrorMessage(res.data);
                return;
            }

            if (res.status === "success") {
               
                const fplManagerDetails = res.data?.fplManagerDetails
                saveToken(res.data?.jwtToken);
                const user: User = fplManagerDetails as User;
                saveUser(user);
                this.setUserInState(user);
                console.log(user)
                this.props.isLoggedInFunc(true);
                this.setLoggedInState(true);
            }
        });
    };

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        /* const newState = Object.assign(this.state, {
             login: { [event.target.id]: event.target.value },
         });*/
        const newState = Object.assign(this.state, {
            login: Object.assign(this.state.login, {
                [event.target.id]: event.target.value
            })
        });
        this.setState(newState);
    };

    private setLoggedInState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });
        this.setState(newState);
    }
    private setUserInState(user: User) {
        const newState = Object.assign(this.state, {
            user: user,
        });
        this.setState(newState);
    }

    private setErrorMessage(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessage: errorMessage,
        });
        this.setState(newState);
    }

    private setFormValidate(validated: boolean) {
        const newState = Object.assign(this.state, {
            validated: validated,
        });
        this.setState(newState);
    }


}
