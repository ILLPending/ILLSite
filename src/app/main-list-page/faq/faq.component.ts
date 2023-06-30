import { Component, OnInit } from '@angular/core';
import { faQuestionCircle, faScroll } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  i_question = faQuestionCircle;
  i_rules = faScroll
  constructor() { }

  ngOnInit(): void {
  }

}
