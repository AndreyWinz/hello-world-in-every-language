import ArkTS
// Index.ets

import router from '@ohos.router';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        // Add a button to respond to user clicks.
        Button() {
          Text('Next')
            .fontSize(30)
            .fontWeight(FontWeight.Bold)
        }
        .type(ButtonType.Capsule)
        .margin({
          top: 20
        })
        .backgroundColor('#0D9FFB')
        .width('40%')
        .height('5%')
        // Bind the onClick event to the Next button so that clicking the button redirects the user to the second page.
        .onClick(() => {
          router.pushUrl({ url: 'pages/Second' })
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
