import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRevealRoutingModule } from './profile-reveal-routing.module';
import { ProfileRevealComponent } from './profile-reveal.component';
import { NameProfileComponent } from './name/name.component';
import { SpeciesComponent } from './species/species.component';
import { RareBreedComponent } from './rare-breed/rare-breed.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HabitsComponent } from './habits/habits.component';
import { HabitDescriptionComponent } from './habits/habit-description/habit-description.component';
import { LandscapeComponent } from './landscape/landscape.component';
import { MapComponent } from './landscape/map/map.component';
import { LandscapeHabitsComponent } from './landscape/landscape-habits/landscape-habits.component';
import { SpeciesDescriptionComponent } from './species/species-description/species-description.component';
import { HabitSummaryComponent } from './habits/habit-summary/habit-summary.component';
import { ProfileRevealInfoComponent } from './profile-reveal-info/profile-reveal-info.component';
import { SpeciesCirclesComponent } from './species/species-circles/species-circles.component';
import { HabitIntroComponent } from './habits/habit-intro/habit-intro.component';
import { HabitExploreComponent } from './habits/habit-explore/habit-explore.component';
import { HabitDiggingComponent } from './habits/habit-digging/habit-digging.component';
import { HabitDownloadComponent } from './habits/habit-download/habit-download.component';

@NgModule({
  declarations: [
    ProfileRevealComponent,
    ProfileRevealInfoComponent,
    NameProfileComponent,
    SpeciesComponent,
    RareBreedComponent,
    HabitsComponent,
    HabitDescriptionComponent,
    HabitSummaryComponent,
    LandscapeComponent,
    LandscapeHabitsComponent,
    MapComponent,
    SpeciesDescriptionComponent,
    SpeciesCirclesComponent,
    HabitIntroComponent,
    HabitExploreComponent,
    HabitDiggingComponent,
    HabitDownloadComponent,
  ],
  exports: [ProfileRevealComponent],
  imports: [CommonModule, SharedModule, ProfileRevealRoutingModule],
})
export class ProfileRevealModule {}
