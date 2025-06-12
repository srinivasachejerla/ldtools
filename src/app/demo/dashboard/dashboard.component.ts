// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { LaunchdarklyService } from '../ui-elements/ui-basic/launchdarkly.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SharedModule, ToastrModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalFlagsCount = 0;
  recentFlags: any[] = [];
  constructor(private launchDarklyService: LaunchdarklyService, private router: Router, private ngbModule: NgbModule, private toastr: ToastrService) {}
  // life cycle event
  ngOnInit() {
    this.launchDarklyService.listFeatureFlags().subscribe(
      (resp)=>{
        console.log(resp);
        this.recentFlags = resp.items;
        this.totalFlagsCount = resp.totalCount;
        this.toastr.success("Pulling Recently created flags");
      },
      (error)=>{
        this.toastr.error("Error while retrieving the flags");
      }
    )
  }
  featureFlagKey: string = '';
  flagStatus : any;
  activeTab = 'test';
  trueUserInput: string = '';
  falseUserInput: string = '';
  trueUserList: string[] = [];
  falseUserList: string[] = [];
  defaultRule: boolean = false;
  showDefaultDropdown: boolean = false;
  showFlagDetails: boolean = false;
  showTooltip = false;

  removeTargetValues: string = '';
  isFlagEnabled: boolean = false;
  flagDefaultRule: boolean = false;
  targetFeatureFlagKey: string = '';
  trueVariationId: string = '';
  falseVariationId: string = '';

  targets = [
    { serve: true, user: 'test' },
    { serve: false, user: '' }
  ];

  getFlagDetails(flagName: string) {
    console.log(flagName);
    this.launchDarklyService.setFlag(flagName);
    this.router.navigate(['/action/flag-status']);
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short', // use 'long' for full month
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    return date.toLocaleString('en-US', options).replace(',', '');
  }
  

  tooltipVisible: { [key: string]: boolean } = {};

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Copied:', text);
        // Optionally show a toast/snackbar
        this.toastr.success('Copied!', text);
      },
      err => {
        console.error('Clipboard copy failed:', err);
      }
    );
  }
  
  showToolTipIcon(key: string): void {
    this.tooltipVisible[key] = true;
  }
  
  hideToolTipIcon(key: string): void {
    this.tooltipVisible[key] = false;
  }
  

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
