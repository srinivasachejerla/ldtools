import { Component, OnInit  } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaunchdarklyService } from '../launchdarkly.service';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-flag',
  standalone: true,
  imports: [SharedModule, ToastrModule],
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss']
})
export default class CreateFlagComponent implements OnInit {
  flagForm!: FormGroup;
  submitted = false;
  newFlagData = { name: '', key: '', description: '' };

  constructor(private launchDarklyService: LaunchdarklyService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.flagForm = this.fb.group({
      name: ['', Validators.required],
      key: ['', Validators.required],
      description: [''],
    });
  }

  createFeatureFlag() {
    this.launchDarklyService.createFeatureFlag(this.newFlagData).subscribe(
      () => {
        this.toastr.success('Feature flag created successfully!');
        this.newFlagData = { name: '', key: '', description: '' };
        this.launchDarklyService.setFlag(this.newFlagData.key);
        this.router.navigate(['/action/flag-status']);
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error while creating feature flag');
      }
    );
  }

  redirectDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
