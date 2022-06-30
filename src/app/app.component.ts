import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inline-edit';

  modelValue = 'apple';

  comboValue = 'value';
  comboText = 'text';

  comboData: any[] = [ 
    { value: 'apple', text: 'Apple'},
    { value: 'banana', text: 'Banana'},
    { value: 'mengo', text: 'Mengo'},
  ]

  public inlineEdit(data) {
    setTimeout(() => {
      this.modelValue = data;
    }, 2000)
    
  }
}
