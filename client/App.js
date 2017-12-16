import React, { Component } from 'react';
import update from 'immutability-helper';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Menu from './components/menu/Menu';
import AddProperty from './components/addProperty/AddProperty';
import Dashboard from './components/dashboard/Dashboard';
import PropertyPage from './components/propertyPage/PropertyPage';
import PropertySetup from './components/propertySetup/PropertySetup';
import Managers from './components/managers/Managers';
import AddServiceItem from './components/addServiceItem/AddServiceItem';
import EditProperty from './components/editProperty/EditProperty';
import CollectRent from './components/collectRent/CollectRent';
import PayABill from './components/payABill/PayABill';
import Accounting from './components/accounting/Accounting';
import Chat from './components/chat/Chat';
import PostSolution from './components/postSolution/PostSolution';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      appClasses: "App",
      loginClasses: "login",
    	headerClasses: "header",
    	burgerToggle: true,
    	burgerClasses : "hamburglar is-open",
    	menuClasses: "menu",
    	addPropClasses: 'add-property',
    	dashboardClasses: "dashboard",
      propertyPageClasses: "property-page",
      propSetupClasses: "property-setup",
      managersClasses: "managers",
      closerClasses: "closer",
      managerClasses: "managers",
      addServiceItemClasses: "add-service-item",
      editPropertyClasses: "edit-property",
      collectRentClasses: "c-rent",
      payABillClasses: 'pay-bill',
      accountingClasses: 'accounting',
      chatClasses: 'chat',
      toggleChatClasses: 'chat-toggler',
      postSolutionClasses: 'post-solution',
    	properties: [],
      rentPayments: [],
      issues: [],
      managers: [],
      managerCode: "",
      currentProperty: {},
      settingUpProperty: {},
      settingUpIndex: 0,
      month: new Date().getMonth(),
      year: new Date().getUTCFullYear()
    }
  }

  //Handle incoming data
  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps);
    if(nextProps.user === null || nextProps.id === null) {
      this.setState({ 
        loggedIn: false,
        loginClasses: 'login login-visible'
      });
    } else {
      const accExists = nextProps.groupAccount.length > 0;
      this.setState({ 
        loggedIn: true, 
        loginClasses: 'login login-visible logged-in',
        properties: nextProps.properties,
        rentPayments: nextProps.payments,
        issues: nextProps.issues,
        managers: accExists ? nextProps.groupAccount[0].managerNames : [],
        managerCode: accExists ? nextProps.groupAccount[0].password : ""
      });
    }
  }

  //Open/Close drawer menu
  toggleBurger = () => {
    this.setState((prevState, prevProps) => {
      this.handleCloser();
    	if(prevState.burgerClasses === "hamburglar is-closed is-arrow") {
    		return {
    			menuClasses: "menu menu-show",
	        addPropClasses: "add-property",
	        headerClasses: "header",
	        burgerClasses : "hamburglar is-closed",
    		}
    	} else {
    		return {
	        burgerToggle : !prevState.burgerToggle,
	        burgerClasses : (prevState.burgerClasses === "hamburglar is-open") ? 
	                          "hamburglar is-closed" : 
	                          "hamburglar is-open",
	        menuClasses: (prevState.menuClasses === 'menu') ?
	        							"menu menu-show" :
	        							"menu",
	       	addPropClasses : (!prevState.burgerToggle) ? 
	                          "add-property" : 
	                          prevState.addPropClasses,
	        dashboardClasses : (prevState.dashboardClasses === "dashboard") ? 
                          "dashboard dashboard-move-left" : 
                          "dashboard",
          propertyPageClasses: (prevState.propertyPageClasses === "property-page property-page-show") ?
                          `${prevState.propertyPageClasses} property-page-shift` :
                          prevState.propertyPageClasses.replace("property-page-shift", "").trim(),
          chatClasses: 'chat'
	      }
    	}
    });
  }

  //toggle new property input
  togglePropertyInput = () => {
    this.setState((prevState, prevProps) => {
      return { 
        menuClasses: (prevState.menuClasses === "menu menu-show") ?
                     "menu menu-show menu-remove" :
                     "menu menu-show",
        addPropClasses: (prevState.addPropClasses === "add-property") ?
                                "add-property add-property-show" :
                                "add-property",
        headerClasses: (prevState.headerClasses === "header") ?
                       "header header-move" :
                       "header",
        burgerClasses : (prevState.burgerClasses === "hamburglar is-closed") ? 
                          "hamburglar is-closed is-arrow" : 
                          "hamburglar is-closed",
      }
    });
  }

  //set delay for UI changes due to drawer menu closing
  setInt = () => {
    let int = 0;
    if(!this.state.burgerToggle) {
      this.toggleBurger();
      int = 550;
    }
    return int;
  }

  //open manager view
  toggleManagers = () => {
    document.getElementById('managers').scrollTop = 0;
    let int = this.setInt();
    setTimeout(() => {
      this.setState({
        managersClasses: "managers managers-show",
        appClasses: "App no-scroll app-shadow",
        closerClasses: "closer closer-show",
        propertyPageClasses: "property-page",
        dashboardClasses: 'dashboard'
      });
    }, int);
  }

  //open service item view
  toggleAddServiceItem = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.setState({
        addServiceItemClasses: "add-service-item add-service-item-show",
        appClasses: "App no-scroll app-shadow",
        closerClasses: "closer closer-show",
        propertyPageClasses: "property-page property-page-show app-shadow no-scroll",
      });
    }, int);
  }

  //toggle edit property view
  toggleEditProperty = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.setState({
        editPropertyClasses: "edit-property edit-property-show",
        appClasses: "App no-scroll app-shadow",
        closerClasses: "closer closer-show",
        propertyPageClasses: "property-page property-page-show app-shadow no-scroll",
      });
    }, int);
  }

  //toggle collect rent view
  toggleCollectRent = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.setState({
        collectRentClasses: 'c-rent c-rent-show',
        appClasses: "App no-scroll app-shadow",
        closerClasses: "closer closer-show",
        propertyPageClasses: "property-page property-page-show app-shadow no-scroll",
      });
    }, int);
  }

  //toggle pay a bill view
  togglePayABill = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.setState({
        payABillClasses: 'pay-bill pay-bill-show',
        appClasses: "App no-scroll app-shadow",
        closerClasses: "closer closer-show",
        propertyPageClasses: "property-page property-page-show app-shadow no-scroll",
      });
    }, int);
  }

  //toggle accounting view
  toggleAccounting = () => {
    this.setState({
      accountingClasses: 'accounting accounting-show',
      appClasses: 'App no-scroll app-shadow',
      closerClasses: 'closer closer-show',
      propertyPageClasses: 'property-page property-page-show app-shadow no-scroll'
    });
  }

  //toggle post solution ui
  togglePostSolution = () => {
    this.setState({
      postSolutionClasses: 'post-solution post-solution-show',
      appClasses: 'App no-scroll app-shadow',
      closerClasses: 'closer closer-show',
      propertyPageClasses: 'property-page property-page-show app-shadow no-scroll'
    });
  }

  //open property page or property set up if not yet configured
  propertyPage = (e) => {
    const int = this.setInt();
    const index = e.target.dataset.index;
    const properties = this.state.properties;
    if(e.target.classList.contains('new-property')) {
      setTimeout(() => {
        this.setState({
          propSetupClasses: "property-setup property-setup-show",
          dashboardClasses: "dashboard dashboard-move-down no-scroll",
          closerClasses: "closer closer-show",
          propertyPageClasses: "property-page",
          appClasses: "App no-scroll",
          settingUpProperty: properties[index],
          settingUpIndex: index,
        });
      }, int);
    } else {
      setTimeout(() => {
        this.setState({
          propertyPageClasses: 'property-page property-page-show',
          currentProperty: properties[index],
          dashboardClasses: "dashboard dashboard-move-up no-scroll",
          appClasses: "App no-scroll",
          managersClasses: 'managers',
          closerClasses: 'closer',
          addServiceItemClasses: 'add-service-item',
          editPropertyClasses: 'edit-property',
          collectRentClasses: 'c-rent',
          payABillClasses: 'pay-bill',
          propertySetupClasses: 'property-setup'
        });
      }, int);
    }
  }

  //toggle chat ui

  toggleChat = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.setState(prevState => {
        return {
          chatClasses: prevState.chatClasses === 'chat' ? 'chat chat-show' : 'chat',
          appClasses: prevState.chatClasses === 'chat' ? 'App no-scroll-mobile' : 'App',
          toggleChatClasses: prevState.chatClasses === 'chat' ? 
                             'chat-toggler chat-toggler-closer' 
                             : 'chat-toggler' 
        }
      });
    }, int);
  }

  //go home
  goHome = () => {
    const int = this.setInt();
    setTimeout(() => {
      this.handleCloser();
      this.setState({
        appClasses: 'App',
        propertyPageClasses: 'property-page',
        dashboardClasses: "dashboard",
        propSetupClasses: "property-setup"
      });
    }, int);
  }

  //handle closing for all UI views
  handleCloser = () => {
    if(this.state.managersClasses === 'managers managers-show') {
      this.setState(prevState => {
        return {
          managersClasses: "managers",
          appClasses: "App",
          closerClasses: "closer",
          propertyPageClasses: prevState.propertyPageClasses === "property-page property-page-show no-scroll app-shadow" ?
                               "property-page property-page-show" :
                               "property-page"
        }
      });
    }
    if(this.state.addServiceItemClasses === 'add-service-item add-service-item-show') {
      this.setState({
        addServiceItemClasses: 'add-service-item',
        appClasses: "App",
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show"
      });
    }
    if(this.state.propSetupClasses === "property-setup property-setup-show") {
      this.setState({
        propSetupClasses: "property-setup",
        dashboardClasses: "dashboard",
        closerClasses: "closer",
        propertyPageClasses: "property-page",
        appClasses: "App"
      });
    }
    if(this.state.editPropertyClasses === "edit-property edit-property-show") {
      this.setState({
        editPropertyClasses: "edit-property",
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show",
      });
    }
    if(this.state.collectRentClasses === 'c-rent c-rent-show') {
      this.setState({
        collectRentClasses: 'c-rent',
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show",
      });
    }
    if(this.state.payABillClasses === 'pay-bill pay-bill-show') {
      this.setState({
        payABillClasses: 'pay-bill',
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show",
      });
    }
    if(this.state.accountingClasses === 'accounting accounting-show') {
      this.setState({
        accountingClasses: 'accounting',
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show",
      });
    }
    if(this.state.postSolutionClasses === 'post-solution post-solution-show') {
      this.setState({
        postSolutionClasses: 'post-solution',
        closerClasses: "closer",
        propertyPageClasses: "property-page property-page-show",
      });
    }
  }

  render = () => {
    return (
      <div className={this.state.appClasses}>
      
        <Login 
          classes={this.state.loginClasses} />

      	{
          this.state.loggedIn &&
          <Header
            classes={this.state.headerClasses}
            burgerClasses={this.state.burgerClasses}
            toggleBurger={this.toggleBurger}
            togglePropInput={this.togglePropertyInput}
            properties={this.state.properties}
            propPage={this.propertyPage}
            goHome={this.goHome}
            toggleManagers={this.toggleManagers} />
        }

      	{
          this.state.loggedIn &&
          <Dashboard 
            classes={this.state.dashboardClasses}
            properties={this.state.properties}
            rentPayments={this.state.rentPayments}
            propPage={this.propertyPage}
            month={this.state.month}
            year={this.state.year}
            issues={this.state.issues}
            toggleManagers={this.toggleManagers} />
        }

      	{
          this.state.loggedIn &&
          <Menu 
            classes={this.state.menuClasses}
            properties={this.state.properties}
            togglePropInput={this.togglePropertyInput}
            propPage={this.propertyPage}
            goHome={this.goHome}
            toggleManagers={this.toggleManagers}
            toggleChat={this.toggleChat} />
        }

      	{
          this.state.loggedIn &&
          <AddProperty
            classes={this.state.addPropClasses}
            togglePropInput={this.togglePropertyInput}
            properties={this.state.properties} />
        }

        {
          this.state.loggedIn &&
          <PropertyPage 
            classes={this.state.propertyPageClasses}
            property={this.state.currentProperty}
            issues={this.state.issues.filter(issue => issue.propId === this.state.currentProperty._id)}
            rentPayments={this.state.rentPayments.filter(payment => payment.propId === this.state.currentProperty._id)}
            month={this.state.month}
            year={this.state.year}
            toggleAddServiceItem={this.toggleAddServiceItem}
            toggleEditProperty={this.toggleEditProperty}
            toggleCollectRent={this.toggleCollectRent}
            togglePayABill={this.togglePayABill}
            toggleAccounting={this.toggleAccounting}
            togglePostSolution={this.togglePostSolution} />
        }

        {
          this.state.loggedIn && 
          <PropertySetup 
            classes={this.state.propSetupClasses}
            property={this.state.settingUpProperty}
            manager={this.state.settingUpManager}
            idx={this.state.settingUpIndex}
            setupProperty={this.updateProperty}
            user={this.state.user}
            toggleToast={this.toggleToast}
            goHome={this.goHome} />
        }

        {
          this.state.loggedIn &&
          <Managers 
            classes={this.state.managersClasses}
            managers={this.state.managers}
            code={this.state.managerCode} />
        }

        {
          this.state.loggedIn &&
          <AddServiceItem
            classes={this.state.addServiceItemClasses}
            property={this.state.currentProperty}
            handleCloser={this.handleCloser} />
        }

        {
          this.state.loggedIn &&
          <EditProperty 
            classes={this.state.editPropertyClasses}
            id={this.state.currentProperty._id}
            name={this.state.currentProperty.property}
            manager={this.state.currentProperty.manager}
            expectedRent={this.state.currentProperty.monthRentExpected}
            handleCloser={this.handleCloser} />
        }

        {
          this.state.loggedIn &&
          <CollectRent
            classes={this.state.collectRentClasses}
            property={this.state.currentProperty}
            handleCloser={this.handleCloser} />
        }

        {
          this.state.loggedIn &&
          <PayABill
            classes={this.state.payABillClasses}
            property={this.state.currentProperty}
            handleCloser={this.handleCloser} />
        }

        {
          this.state.loggedIn &&
          <Accounting
            classes={this.state.accountingClasses}
            property={this.state.currentProperty}
            issues={this.state.issues.filter(issue => issue.propId === this.state.currentProperty._id)}
            rentPayments={this.state.rentPayments.filter(payment => payment.propId === this.state.currentProperty._id)}
            handleCloser={this.handleCloser} />
        }

        {
          this.state.loggedIn &&
          <Chat 
            classes={this.state.chatClasses}
            conversations={this.props.conversations}
            managers={this.state.managers}
            messages={this.props.messages}
            toggleChat={this.toggleChat} />
        }

        {
          this.state.loggedIn &&
          <PostSolution 
            classes={this.state.postSolutionClasses} />
        }

        {
          this.state.loggedIn &&
          <button 
            onClick={this.toggleChat}
            className={this.state.toggleChatClasses}>
            <img src="mess.svg" alt="open messenger" />
            <img src="close2.svg" alt="close messenger" />
          </button>
        }

        {
          this.state.loggedIn &&
          <button 
            onClick={this.handleCloser}
            className={this.state.closerClasses}></button>
        }
      </div>
    );
  }
}