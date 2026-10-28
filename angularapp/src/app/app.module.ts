import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { CreatefeedComponent } from './components/createfeed/createfeed.component';
import { CreatelivestockComponent } from './components/createlivestock/createlivestock.component';
import { CreatemedicineComponent } from './components/createmedicine/createmedicine.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OwnereditlivestockComponent } from './components/ownereditlivestock/ownereditlivestock.component';
import { OwnerviewfeedComponent } from './components/ownerviewfeed/ownerviewfeed.component';
import { OwnerviewmedicineComponent } from './components/ownerviewmedicine/ownerviewmedicine.component';
import { OwnerviewrequestComponent } from './components/ownerviewrequest/ownerviewrequest.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestformComponent } from './components/requestform/requestform.component';
import { SuppliereditfeedComponent } from './components/suppliereditfeed/suppliereditfeed.component';
import { SupplierEditMedicineComponent } from './components/suppliereditmedicine/suppliereditmedicine.component';
import { SupplierrequestsComponent } from './components/supplierrequests/supplierrequests.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { ViewfeedComponent } from './components/viewfeed/viewfeed.component';
import { ViewlivestockComponent } from './components/viewlivestock/viewlivestock.component';
import { ViewmedicineComponent } from './components/viewmedicine/viewmedicine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { OwnerhomeComponent } from './components/ownerhome/ownerhome.component';
import { AiassistantComponent } from './components/aiassistant/aiassistant.component';
import { BoliaiComponent } from './components/boliai/boliai.component';
import { BolifabComponent } from './components/bolifab/bolifab.component';
import { MonsoonguardComponent } from './components/monsoonguard/monsoonguard.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminnavComponent,
    AdminviewfeedbackComponent,
    CreatefeedComponent,
    CreatelivestockComponent,
    CreatemedicineComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    OwnereditlivestockComponent,
    OwnerviewfeedComponent,
    OwnerviewmedicineComponent,
    OwnerviewrequestComponent,
    RegistrationComponent,
    RequestformComponent,
    SuppliereditfeedComponent,
    SupplierEditMedicineComponent,
    SupplierrequestsComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserviewfeedbackComponent,
    ViewfeedComponent,
    ViewlivestockComponent,
    ViewmedicineComponent,
    AdminhomeComponent,
    OwnerhomeComponent,
    AiassistantComponent,
    BoliaiComponent,
    BolifabComponent,
    MonsoonguardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }