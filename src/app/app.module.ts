import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WeatherItemComponent } from './components/weather-item/weather-item.component';
import { WeatherListComponent } from './components/weather-list/weather-list.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { NavComponent } from './components/nav/nav.component';

// import modules
import {MaterialModule} from '../app/modules/material.module';
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

// for routing
import { AppRoutingModule } from './modules/app-routing.module';

//for store
import { StoreModule } from '@ngrx/store';
import { AppStoreModule } from './modules/app-store.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

//for pull data from accuWeather
import { LocationService } from './services/location.service';

@NgModule({
  declarations: [
    AppComponent,
    WeatherItemComponent,
    WeatherListComponent,
    CurrentWeatherComponent,
    NavComponent,
    FavoritesPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppStoreModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })

  ],
  providers: [LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
