import { Component, OnInit  } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaunchdarklyService } from '../launchdarkly.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-flag-status',
  standalone: true,
  imports: [SharedModule, ToastrModule, RouterModule],
  templateUrl: './flag-status.component.html',
  styleUrls: ['./flag-status.component.scss']
})
export default class FlagStatusComponent {
  totalFlagsCount = 0;
  recentFlags: any[] = [];
  constructor(private launchDarklyService: LaunchdarklyService, private router: Router, private ngbModule: NgbModule, private route: ActivatedRoute, private toastr: ToastrService) {
    
  }
  featureFlagKey: string = '';
  // life cycle event
  ngOnInit() {
    this.launchDarklyService.flag$.subscribe(flag => {
      console.log('Flag from service:', flag);
      if (flag) {
        console.log('Flag received:', flag);
        this.featureFlagKey = flag;
        this.getFlagStatus();
      } else {
        console.log('No flag received');
      }
    });
  }
  ngOnDestroy() {
    this.launchDarklyService.setFlag(null);
  }
  flagStatus : any;
  activeTab = 'test';
  trueUserInput: string = '';
  falseUserInput: string = '';
  trueUserInputProd: string = '';
  falseUserInputProd: string = '';
  trueUserList: string[] = [];
  falseUserList: string[] = [];
  defaultRule: boolean = false;
  showDefaultDropdown: boolean = false;
  showFlagDetails: boolean = false;
  showTooltip = false;

  removeTargetValues: string = '';
  isFlagEnabled: boolean = false;
  isFlagEnabledProd: boolean = false;
  flagDefaultRule: boolean = false;
  flagDefaultRuleProd: boolean = false;
  targetFeatureFlagKey: string = '';
  trueVariationId: string = '';
  falseVariationId: string = '';
  targetData: string = '';

  targets = [
    { serve: true, user: 'test' },
    { serve: false, user: '' }
  ];
  
  tooltipVisible: { [key: string]: boolean } = {};

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Copied:', text);
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

  toggleDefaultDropdown(): void {
    this.showDefaultDropdown = !this.showDefaultDropdown;
  }

  getFlagStatus() {
    if(!this.featureFlagKey) {
      this.showFlagDetails = false;
      this.toastr.error('Please enter a feature flag first!');
      return;
    }
    this.launchDarklyService.getFlagStatus(this.featureFlagKey).subscribe(
      (data) => {
        this.flagStatus = data;
        console.log(data);
        this.showFlagDetails = true;
        this.isFlagEnabled = data.environments.test.on;
        this.isFlagEnabledProd = data.environments.production.on;
        this.targetFeatureFlagKey = data.key;
        this.flagDefaultRule = (this.isFlagEnabled) ? ((data.environments.test.fallthrough.variation == 0) ? true : false) : false;
        this.flagDefaultRuleProd = (this.isFlagEnabledProd) ? ((data.environments.production.fallthrough.variation == 0) ? true : false) : false;
        this.trueVariationId = data.variations[0]._id;
        this.falseVariationId = data.variations[1]._id;
        // this.toastr.success(this.featureFlagKey + ' Flag Status fetched successfully!');
      },
      (error) => {
        console.error(error);
        this.toastr.error(this.featureFlagKey + ' Flag Status fetch failed! Kindly check the flag created or not. If not, create the flag first!');
        this.trueVariationId = '';
        this.flagDefaultRule = false;
        this.isFlagEnabled = false;
        this.flagDefaultRuleProd = false;
        this.isFlagEnabledProd = false;
        this.flagStatus = false;
      }
    );  
  }

  toggleDefaultRule(){
    console.log(this.flagDefaultRule);
    this.showDefaultDropdown = false;
    var tempVariation = this.flagDefaultRule ? this.trueVariationId : this.falseVariationId;
    this.launchDarklyService.toggleDefaultRule(this.featureFlagKey, tempVariation).subscribe(
      () => {
        this.toastr.success(this.featureFlagKey + ' Default Rule Changed successfully!');
        this.getFlagStatus();
      },
      (error) => {
        this.isFlagEnabled = false;
        this.flagDefaultRule = false;
        console.error(error);
        this.toastr.error(this.featureFlagKey + 'Default Rule Failed. Kindly check the flag status!');
      }
    );
  }

  toggleFlag() {
    this.launchDarklyService.updateFlag(this.featureFlagKey, this.isFlagEnabled).subscribe(
      () => {
        this.toastr.success(this.featureFlagKey + ' Flag toggled successfully!');
        this.getFlagStatus();
      },
      (error) => {
        this.isFlagEnabled = false;
        console.error(error);
        this.toastr.error(this.featureFlagKey + ' Flag toggle failed! Kindly check the flag status!');
      }
    );
  }

  addTrueTargetToFlag() {
    if(this.flagStatus && this.flagStatus.environments.test.on) {
      this.launchDarklyService.addTrueTargetToFlag(this.targetFeatureFlagKey, this.trueUserInput, this.flagStatus.variations[0]._id, this.flagStatus.variations[1]._id).subscribe(
        () => {
          this.toastr.success("Target added successfully!");
          this.trueUserInput = '';
          this.targetFeatureFlagKey = '';
          this.getFlagStatus();
        },
        (error) => {console.error(error);
        this.toastr.error("Adding Target Failed!. Kindly try again!");
      }
      ); 
    } else {
      this.toastr.error(this.featureFlagKey + ' Flag is Not Enabled. Kindly enable the flag first!');
    }
  }

  addFalseTargetToFlag() {
    if(this.flagStatus && this.flagStatus.environments.test.on) {
      this.launchDarklyService.addFalseTargetToFlag(this.targetFeatureFlagKey, this.falseUserInput, this.flagStatus.variations[0]._id, this.flagStatus.variations[1]._id).subscribe(
        () => {
          this.toastr.success("Target added successfully!");
          this.falseUserInput = '';
          this.targetFeatureFlagKey = '';
          this.getFlagStatus();
        },
        (error) => {console.error(error);
        this.toastr.error("Adding Target Failed!. Kindly try again!");
      }
      ); 
    } else {
      this.toastr.error(this.featureFlagKey + ' Flag is Not Enabled. Kindly enable the flag first!');
    }
  }

  removeTarget(user, variation) {
    console.log(user);
    console.log(variation);
    if(this.flagStatus && this.flagStatus.environments.test.on) {
      this.launchDarklyService.removeTarget(this.targetFeatureFlagKey, user, this.flagStatus.variations[variation]._id).subscribe(
        () => {
          this.toastr.success(this.featureFlagKey + ' Target removed successfully!');
          this.getFlagStatus();
          this.removeTargetValues = '';
          this.targetFeatureFlagKey = '';
        },
        (error) => {
          console.error(error);
          this.toastr.error(this.featureFlagKey + ' Failed! Kindly check the flag status!');
        }
      );  
    } else {
      this.toastr.error(this.featureFlagKey + ' Flag is Not Enabled. Kindly enable the flag first!');
    }
  }
}
