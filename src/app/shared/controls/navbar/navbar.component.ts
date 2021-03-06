import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  CreativeSpeciesEnum,
  CREATIVE_SPECIES_WHITE_BG,
  CREATIVE_SPECIES_LIGHT_BURGER,
} from 'src/app/core/models/creative-species.enum';
import { AppState } from 'src/app/core/ngxs/app/app.state';
import { InterviewState } from 'src/app/core/ngxs/interview/interview.state';
import { NavbarService } from 'src/app/core/services/navbar.service';

const PAGES_WITH_BLACK_HEADER = ['species', 'habits'];

class NavbarElements {
  showNavbar: boolean = true;
  menu: boolean = false;
  audio: boolean = false;
  profileInfo: boolean = false;
  surveyFAQ: boolean = false;
  rightPlaceholder: boolean = false;
  burger: boolean = false;
}

const NavbarSet = {
  login: {
    burger: false,
    showNavbar: true,
    audio: true,
  } as NavbarElements,
  home: {
    burger: true,
    audio: true,
    showNavbar: true,
  } as NavbarElements,
  survey: {
    burger: true,
    audio: true,
    surveyFAQ: true,
    showNavbar: true,
  } as NavbarElements,
  profileRevealFirst: {
    burger: true,
    audio: true,
    showNavbar: true,
  } as NavbarElements,
  profileRevealMain: {
    burger: true,
    menu: true,
    audio: true,
    profileInfo: true,
    showNavbar: true,
  } as NavbarElements,
  profileRevealLandscape: {
    burger: true,
    menu: true,
    audio: true,
    showNavbar: true,
    rightPlaceholder: true,
  } as NavbarElements,
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() openMenu = new EventEmitter<null>();
  @ViewChild('audio') audioRef: ElementRef<HTMLAudioElement> | undefined;

  isAudioEnabled: boolean = false;
  audioSource$: Observable<string> = this.navbarService.audioSource$;
  audioToggleEvent$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.isAudioEnabled
  );
  currentNavbarSet: NavbarElements = NavbarSet.home;

  wasAudioBtnClick$ = this.navbarService.wasAudioBtnClick$;
  isAudioPlay$ = this.navbarService.isAudioPlay$;

  createiveSpecies$: Observable<
    CreativeSpeciesEnum | undefined
  > = this.store
    .select(InterviewState.result)
    .pipe(map((result) => result?.Creative_Species));

  darkModeCommon$ = combineLatest([
    this.store
      .select((state) => state.router)
      .pipe(
        map((routerState) => routerState.state?.url),
        map((url) => this.router.parseUrl(url)),
        map(
          (url) =>
            url.root.children.primary && url.root.children.primary.segments
        ),
        map((segments) =>
          segments ? [segments[0].path, segments[1]?.path] : [null]
        ),
        map(
          (urlSegments) =>
            !!urlSegments[1] && PAGES_WITH_BLACK_HEADER.includes(urlSegments[1])
        )
      ),
    this.createiveSpecies$.pipe(
      map((species) =>
        species ? CREATIVE_SPECIES_WHITE_BG.includes(species) : false
      )
    ),
  ]).pipe(map((statements) => !statements.some((val) => !val)));

  darkModeLandscapeHabits$ = this.store
    .select(AppState.landscapeHabitsData)
    .pipe(
      map(
        (landscapeHabitsData) =>
          landscapeHabitsData.isLandscapeHabits &&
          landscapeHabitsData.selectedCluster &&
          CREATIVE_SPECIES_WHITE_BG.includes(
            landscapeHabitsData.selectedCluster
          )
      )
    );

  darkModeClass$ = combineLatest([
    this.darkModeCommon$,
    this.darkModeLandscapeHabits$,
  ]).pipe(map((statements) => statements.some((val) => !!val)));

  isLightBurger$ = this.createiveSpecies$.pipe(
    map((species) =>
      species ? CREATIVE_SPECIES_LIGHT_BURGER.includes(species) : false
    )
  );

  constructor(
    private store: Store,
    private router: Router,
    private navbarService: NavbarService
  ) {
    this.isAudioPlay$.subscribe((val)=>{
      if(val) {
        this.playAudio();
      }
    })
  }

  ngOnInit() {
    this.store
      .select((state) => state.router)
      .pipe(
        map((routerState) => routerState.state?.url),
        map((url) => this.router.parseUrl(url)),
        map(
          (url) =>
            url.root.children.primary && url.root.children.primary.segments
        ),
        map((segments) =>
          segments ? [segments[0].path, segments[1]?.path] : [null]
        )
      )
      .subscribe((pages) => {
        switch (pages[0]) {
          case null:
            this.currentNavbarSet = NavbarSet.login;
            break;
          case 'loading':
              this.currentNavbarSet = NavbarSet.login;
              break;
          case 'home':
            this.currentNavbarSet = NavbarSet.home;
            break;
          case 'survey':
            this.currentNavbarSet = NavbarSet.survey;
            break;
          case 'profile-reveal':
            if (!pages[1]) {
              this.currentNavbarSet = NavbarSet.profileRevealFirst;
            } else if (pages[1] === 'landscape') {
              this.currentNavbarSet = NavbarSet.profileRevealLandscape;
            } else {
              this.currentNavbarSet = NavbarSet.profileRevealMain;
            }
            break;
          default:
            this.currentNavbarSet = NavbarSet.home;
            break;
        }
      });

    combineLatest([
      this.audioToggleEvent$,
      this.audioSource$.pipe(delay(100)),
    ]).subscribe(([enabled, source]) => {
      if (this.audioRef) {
        if (enabled && source) {
          this.audioRef.nativeElement.play();
        } else {
          this.audioRef.nativeElement.pause();
        }
      }
    });
  }

  showMenu() {
    this.openMenu.next();
  }

  toggleAudio() {
    this.isAudioEnabled = !this.isAudioEnabled;
    this.audioToggleEvent$.next(this.isAudioEnabled);
    this.navbarService.audioBtnClick();
  }

  playAudio() {
    this.isAudioEnabled = true;
    this.audioToggleEvent$.next(this.isAudioEnabled);
    this.navbarService.audioBtnClick();
  }

  showServeqFAQ() {
    this.navbarService.showSurveyFAQ$.next();
  }

  showProfileRevealInfo() {
    this.navbarService.showProfileRevealInfo$.next();
  }
}
