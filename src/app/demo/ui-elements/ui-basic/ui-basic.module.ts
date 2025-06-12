import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchDarklyRoutingModule } from './launch-darkly-routing.module';
import { LaunchdarklyService } from './launchdarkly.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Whole library (if needed)
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [CommonModule, LaunchDarklyRoutingModule, HttpClientModule, NgbModule, FormsModule, ToastrModule.forRoot()],
  providers: [],
})
export class UiBasicModule {}
