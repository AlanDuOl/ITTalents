import { Component, OnInit } from '@angular/core';
import { ProfileResult } from '../model-data';
import { ProfilesService } from '../profiles.service';

@Component({
  selector: 'profiles-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent implements OnInit {

  submitResult: ProfileResult = null;

  constructor(private service: ProfilesService) { }

  ngOnInit() {
    this.submitResult = this.service.submittedResult;
  }
}
