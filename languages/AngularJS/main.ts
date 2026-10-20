import 'zone.js';
import '@angular/compiler';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1 style="color: #5C6AC4;">Hello, World!</h1>
    </div>
  `
})
class AppComponent {}

bootstrapApplication(AppComponent).catch(err => console.error(err));
