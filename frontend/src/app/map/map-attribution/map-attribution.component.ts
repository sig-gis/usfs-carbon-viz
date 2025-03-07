import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-attribution',
  template: `
      <div class="map-attributions">
        <div class="logos">
          <span class="powered-by">Powered by</span>
          <a href="https://earthengine.google.com/"
            rel="noopener noreferrer"
            target="_blank">
            <img class="ee-logo"
                src="data:image/png;base64,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"
                alt="google earth engine"
                width="115">
          </a>
        </div>
      </div>
    `,
  styles: [`.map-attributions {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 5px;
        background: rgba(255,255,255,0.9);
        z-index: 1;
        border-radius: 3px;
        margin: 0 10px 10px 0;
      }
      .logos {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .powered-by {
        padding-top: 3px;
        font-size: 12px;
        color: gray;
      }
      `
  ]
})
export class MapAttributionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
