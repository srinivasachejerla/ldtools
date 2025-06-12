import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-manage-targets',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './manage-targets.component.html',
  styleUrls: ['./manage-targets.component.scss']
})
export default class ManageTargetsComponent {}
