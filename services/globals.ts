export abstract class GlobalMembersService {
  protected _showSideNav: boolean

  get showSideNav(): boolean {
    return this._showSideNav
  }
}