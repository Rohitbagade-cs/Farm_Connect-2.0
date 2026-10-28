// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { RegistrationComponent } from './components/registration/registration.component';
// import { HomeComponent } from './components/home/home.component';
// import { LoginComponent } from './components/login/login.component';
// import { UsernavComponent } from './components/usernav/usernav.component';
// import { AdminnavComponent } from './components/adminnav/adminnav.component';
// import { CreatemedicineComponent } from './components/createmedicine/createmedicine.component';
// import { ViewmedicineComponent } from './components/viewmedicine/viewmedicine.component';
// import { SupplierEditMedicineComponent } from './components/suppliereditmedicine/suppliereditmedicine.component';
// import { CreatefeedComponent } from './components/createfeed/createfeed.component';
// import { ViewfeedComponent } from './components/viewfeed/viewfeed.component';
// import { SuppliereditfeedComponent } from './components/suppliereditfeed/suppliereditfeed.component';
// import { RequestformComponent } from './components/requestform/requestform.component';
// import { SupplierrequestsComponent } from './components/supplierrequests/supplierrequests.component';
// import { CreatelivestockComponent } from './components/createlivestock/createlivestock.component';
// import { ViewlivestockComponent } from './components/viewlivestock/viewlivestock.component';
// import { OwnereditlivestockComponent } from './components/ownereditlivestock/ownereditlivestock.component';
// import { OwnerviewmedicineComponent } from './components/ownerviewmedicine/ownerviewmedicine.component';
// import { OwnerviewfeedComponent } from './components/ownerviewfeed/ownerviewfeed.component';
// import { OwnerviewrequestComponent } from './components/ownerviewrequest/ownerviewrequest.component';
// import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
// import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
// import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';

// const routes: Routes = [
//   {path: '' , component: HomeComponent},
//   {path:'register' , component: RegistrationComponent},
//   { path: 'login', component: LoginComponent },
//   {path:'owner', component: UsernavComponent},
//   {path: 'supplier', component: AdminnavComponent},
//   { path: 'suppliereditfeed/:id', component: SuppliereditfeedComponent },

//   { path: 'admin/feed', component: CreatefeedComponent },
//   { path: 'admin/feed/view', component: ViewfeedComponent },
//   { path: 'admin/requests', component: SupplierrequestsComponent },
//   {path: 'admin/home' , component: HomeComponent},
//   {path: 'admin/medicine/add' , component: CreatemedicineComponent },
//   {path: 'admin/medicine/view' , component: ViewmedicineComponent},
//   { path: 'admin/feedbacks', component: AdminviewfeedbackComponent },

//   { path: 'admin/medicine/view/suppliereditmedicine/:medicineId', component: SupplierEditMedicineComponent },
  

//   //  Aliases for owner navbar links
// { path: 'medicines', component: OwnerviewmedicineComponent },
// { path: 'feeds', component: OwnerviewfeedComponent },
// { path: 'viewlivestocks', component: ViewlivestockComponent },


//   {path:'createlivestock', component:CreatelivestockComponent},
//   {path:'viewlivestock', component:ViewlivestockComponent},
//   {path:'ownereditlivestock/:id',component:OwnereditlivestockComponent},
//   {path:'viewmedicine',component:OwnerviewmedicineComponent},
//   {path:'viewfeeds',component:OwnerviewfeedComponent},
//   {path:'requestform', component:RequestformComponent},
//   {path:'requestform/:id', component:RequestformComponent},
//   { path: 'ownerviewrequest', component:OwnerviewrequestComponent },
//   { path: 'useraddfeedback', component: UseraddfeedbackComponent},
//   { path: 'ownerviewfeedback', component:UserviewfeedbackComponent}

// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }










import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './components/authguard/auth.guard';

import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { UsernavComponent } from './components/usernav/usernav.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';

import { CreatemedicineComponent } from './components/createmedicine/createmedicine.component';
import { ViewmedicineComponent } from './components/viewmedicine/viewmedicine.component';
import { SupplierEditMedicineComponent } from './components/suppliereditmedicine/suppliereditmedicine.component';

import { CreatefeedComponent } from './components/createfeed/createfeed.component';
import { ViewfeedComponent } from './components/viewfeed/viewfeed.component';
import { SuppliereditfeedComponent } from './components/suppliereditfeed/suppliereditfeed.component';

import { SupplierrequestsComponent } from './components/supplierrequests/supplierrequests.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';

import { CreatelivestockComponent } from './components/createlivestock/createlivestock.component';
import { ViewlivestockComponent } from './components/viewlivestock/viewlivestock.component';
import { OwnereditlivestockComponent } from './components/ownereditlivestock/ownereditlivestock.component';
import { OwnerviewmedicineComponent } from './components/ownerviewmedicine/ownerviewmedicine.component';
import { OwnerviewfeedComponent } from './components/ownerviewfeed/ownerviewfeed.component';
import { OwnerviewrequestComponent } from './components/ownerviewrequest/ownerviewrequest.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { RequestformComponent } from './components/requestform/requestform.component';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { OwnerhomeComponent } from './components/ownerhome/ownerhome.component';
import { AiassistantComponent } from './components/aiassistant/aiassistant.component';
import { MonsoonguardComponent } from './components/monsoonguard/monsoonguard.component';

const routes: Routes = [

  /* =========================
     PUBLIC ROUTES (NO GUARD)
     ========================= */
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },

  /* =========================
     OWNER ROUTES (SECURED)
     ========================= */
  // {
  //   path: 'owner',
  //   component: UsernavComponent,
  //   canActivate: [authGuard],
  //   data: { roles: ['Owner'] }
  // },

  // { path: 'createlivestock', component: CreatelivestockComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'viewlivestock', component: ViewlivestockComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'viewlivestocks', component: ViewlivestockComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'ownereditlivestock/:id', component: OwnereditlivestockComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },

  // { path: 'medicines', component: OwnerviewmedicineComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'feeds', component: OwnerviewfeedComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'viewmedicine', component: OwnerviewmedicineComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'viewfeeds', component: OwnerviewfeedComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },

  // { path: 'requestform', component: RequestformComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'requestform/:id', component: RequestformComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },

  // { path: 'ownerviewrequest', component: OwnerviewrequestComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'useraddfeedback', component: UseraddfeedbackComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },
  // { path: 'ownerviewfeedback', component: UserviewfeedbackComponent, canActivate: [authGuard], data: { roles: ['Owner'] } },

  /* =========================
   OWNER ROUTES (SECURED)
   ========================= */
{
  path: 'owner',
  component: UsernavComponent,
  canActivate: [authGuard],
  data: { roles: ['Owner'] },
  children: [

    // ✅ DEFAULT OWNER DASHBOARD
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: OwnerhomeComponent },

    // ✅ LIVESTOCK
    { path: 'createlivestock', component: CreatelivestockComponent },
    { path: 'viewlivestock', component: ViewlivestockComponent },
    { path: 'viewlivestocks', component: ViewlivestockComponent },
    { path: 'ownereditlivestock/:id', component: OwnereditlivestockComponent },

    // ✅ MEDICINES & FEEDS
    { path: 'medicines', component: OwnerviewmedicineComponent },
    { path: 'feeds', component: OwnerviewfeedComponent },
    { path: 'viewmedicine', component: OwnerviewmedicineComponent },
    { path: 'viewfeeds', component: OwnerviewfeedComponent },

    // ✅ REQUESTS
    { path: 'requestform', component: RequestformComponent },
    { path: 'requestform/:id', component: RequestformComponent },
    { path: 'ownerviewrequest', component: OwnerviewrequestComponent },

    // ✅ FEEDBACK
    { path: 'useraddfeedback', component: UseraddfeedbackComponent },
    { path: 'ownerviewfeedback', component: UserviewfeedbackComponent },

    // ✅ AI ASSISTANT
    { path: 'aiassistant', component: AiassistantComponent },
    { path: 'monsoonguard', component: MonsoonguardComponent }
  ]
},

  /* =========================
     SUPPLIER / ADMIN ROUTES
     ========================= */
  // {
  //   path: 'supplier',
  //   component: AdminnavComponent,
  //   canActivate: [authGuard],
  //   data: { roles: ['Supplier', 'Admin'] }
  // },

  // { path: 'admin/home', component: HomeComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },

  // { path: 'admin/medicine/add', component: CreatemedicineComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },
  // { path: 'admin/medicine/view', component: ViewmedicineComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },
  // { path: 'admin/medicine/view/suppliereditmedicine/:medicineId', component: SupplierEditMedicineComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },

  // { path: 'admin/feed', component: CreatefeedComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },
  // { path: 'admin/feed/view', component: ViewfeedComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },
  // { path: 'suppliereditfeed/:id', component: SuppliereditfeedComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },

  // { path: 'admin/requests', component: SupplierrequestsComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } },
  // { path: 'admin/feedbacks', component: AdminviewfeedbackComponent, canActivate: [authGuard], data: { roles: ['Supplier', 'Admin'] } }


/* =========================
   SUPPLIER / ADMIN ROUTES
   ========================= */

   {
    path: 'admin',
    component: AdminnavComponent,
    canActivate: [authGuard],
    data: { roles: ['Supplier', 'Admin'] },
    children: [
  
      // ✅ DEFAULT PAGE AFTER LOGIN
      { path: '', redirectTo: 'home', pathMatch: 'full' },
  
      // ✅ ADMIN DASHBOARD (NOT public HomeComponent)
      { path: 'home', component: AdminhomeComponent },
  
      // ✅ MEDICINE
      { path: 'medicine/add', component: CreatemedicineComponent },
      { path: 'medicine/view', component: ViewmedicineComponent },
      { path: 'medicine/view/suppliereditmedicine/:medicineId', component: SupplierEditMedicineComponent },
  
      // ✅ FEED
      { path: 'feed', component: CreatefeedComponent },
      { path: 'feed/view', component: ViewfeedComponent },
      { path: 'suppliereditfeed/:id', component: SuppliereditfeedComponent },
  
      // ✅ REQUESTS & FEEDBACK
      { path: 'requests', component: SupplierrequestsComponent },
      { path: 'feedbacks', component: AdminviewfeedbackComponent },

      // ✅ AI ASSISTANT
      { path: 'aiassistant', component: AiassistantComponent }
    ]
  },
  
  // ✅ OLD ENTRY POINT SUPPORT
  { path: 'supplier', redirectTo: 'admin', pathMatch: 'full' }
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}