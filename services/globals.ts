class SideNavInfo {
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

class SpinnerInfo {
  private _isVisible = true

  constructor() {
  }

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

  private _sideNav: SideNavInfo
  private _spinner: SpinnerInfo

  constructor(
    protected readonly navBarColor = 'koi-orange',
    protected readonly isContentCentered = true,
    isSideNavFixed = true
  ) {
    this._sideNav = new SideNavInfo(isSideNavFixed)
    this._spinner = new SpinnerInfo()
  }

  get sideNav(): SideNavInfo {
    return this._sideNav
  }

  get spinner(): SpinnerInfo {
    return this._spinner
  }
}
