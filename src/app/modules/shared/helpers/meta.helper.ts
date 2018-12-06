import { Meta, Title } from '@angular/platform-browser';

import { IMetaData, IOgMeta, ITwitterMeta } from '../models/meta-data';

export class MetaHelper {
  protected metaData: IMetaData;

  private ogPrefix: string = 'og:';
  private twPrefix: string = 'twitter:';

  constructor(protected title: Title, protected meta: Meta) {}

  protected setMetaData(): void {
    if (!this.metaData) return;

    if (this.metaData.title) {
      this.title.setTitle(this.metaData.title);
    }

    if (this.metaData.description) {
      this.meta.updateTag({
        name: 'description',
        content: this.metaData.description,
      });
    }

    this.setSocialMeta(this.metaData.og, this.ogPrefix);
    this.setSocialMeta(this.metaData.twitter, this.twPrefix);
  }

  private setSocialMeta(data: IOgMeta | ITwitterMeta, prefix: string): void {
    Object.keys(data)
      .forEach(prop => (
        this.meta.updateTag({
          name: `${prefix}${prop}`,
          content: data[prop],
        })
      ))
    ;
  }
}
