class SideNav {

  private _exists = false
  private _requiresSpace = false

  constructor(readonly isFixed: boolean) {
  }

  get exists(): boolean {
    return this._exists
  }

  get requiresSpace(): boolean {
    return this._requiresSpace
  }

  show(): void {
    this._exists = true
    if (this.isFixed) {
      this._requiresSpace = true
    }
  }

  hide(): void {
    this._exists = false
    if (this.isFixed) {
      this._requiresSpace = false
    }
  }
}


class Spinner {

  private _isVisible = true

  get isVisible(): boolean {
    return this._isVisible
  }

  show(): void {
    this._isVisible = true
  }

  hide(): void {
    this._isVisible = false
  }
}


export abstract class GlobalMembersService {

  private _sideNav: SideNav
  private _spinner: Spinner

  constructor(
    readonly navBarColor = 'koi-orange',
    readonly isContentCentered = true,
    isSideNavFixed = true
  ) {
    this._sideNav = new SideNav(isSideNavFixed)
    this._spinner = new Spinner()
  }

  get sideNav(): SideNav {
    return this._sideNav
  }

  get spinner(): Spinner {
    return this._spinner
  }
}
