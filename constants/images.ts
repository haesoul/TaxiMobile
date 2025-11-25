// import SITE_CONSTANTS from '../siteConstants'

// const names = {
//   arrowDown: 'arrowDown.svg',
//   arrows: 'arrows.svg',
//   avatar: 'avatar.svg',
//   activeAvatar: 'activeAvatar.svg',
//   businessTaxi: 'business-taxi.svg',
//   carAlt: 'car-alt.svg',
//   cash: 'cash.svg',
//   checkMark: 'check-mark.svg',
//   economTaxi: 'econom-taxi.svg',
//   flagRu: 'flag-ru.svg',
//   flagGb: 'flag-gb.svg',
//   flagFr: 'flag-fr.svg',
//   flagMar: 'flag-ma.svg',
//   activeMarker: 'mark-colored.svg',
//   inactiveMarker: 'mark-uncolored.svg',
//   menuIcon: 'menu-icon.svg',
//   messageIcon: 'message-icon.svg',
//   multipleUsers: 'multiple-users.svg',
//   notoTaxi: 'noto-taxi.svg',
//   plusIcon: 'plus-icon.svg',
//   clock: 'clock.svg',
//   driverAvatar: 'driver-avatar.svg',
//   solidCar: 'fa-solid_car.svg',
//   subwayIdCard: 'subway-id-card.svg',
//   card: 'card.svg',
//   stars: 'stars.svg',
//   starEmpty: 'star-empty.svg',
//   starFull: 'star-full.svg',
//   cardIcon: 'card-icon.svg',
//   photoCamera: 'photo-camera.svg',
//   helpIcon: 'help-icon.svg',
//   timer: 'timer.svg',
//   closeIcon: 'close-icon.svg',
//   cardIconGrey: 'card-icon-grey.svg',
//   chatIcon: 'chat-icon.svg',
//   minusCircle: 'minus-circle.svg',
//   minusIcon: 'minus-icon.svg',
//   plusCircle: 'plus-circle.svg',
//   people: 'people.svg',
//   recomended: 'recomended.svg',
//   requested: 'requested.svg',
//   turn: 'turn.svg',
//   uGroup: 'u-group.svg',
//   clockGrey: 'grey-clock.svg',
//   clockGreen: 'clock-green.svg',
//   turnBr: 'turn-br.svg',
//   cardIconBr: 'card-icon-br.svg',
//   chatIconBr: 'chat-icon-br.svg',
//   mapIcon: 'map-icon.svg',
//   mapArrow: 'map-arrow.svg',
//   mapArrowVoting: 'map-arrow-voting.svg',
//   mapOrderVoting: 'map-voting.svg',
//   mapOrderWating: 'map-waiting.svg',
//   mapOrderPerforming: 'map-performing.svg',
//   mapMarkerProfit: 'map-marker-profit.svg',
//   mapArrowHome: 'map-arrow-home.svg',
//   returnIcon: 'return-icon.svg',
//   passengerAvatar: 'passenger-avatar.svg',
//   clockBlue: 'clock-blue.svg',
//   markerGreen: 'marker-green.svg',
//   markerYellow: 'marker-yellow.svg',
//   loading: 'loading.gif',
//   markerFrom: 'marker-from.svg',
//   markerTo: 'marker-to.svg',
//   voting: 'voting.svg',
//   votingRed: 'voting-red.svg',
//   waiting: 'waiting.svg',
//   delivery: 'delivery.svg',
//   light: 'light.svg',
//   truck: 'truck.svg',
//   wagon: 'wagon.svg',
//   foot: 'foot.svg',
//   bicycle: 'bicycle.svg',
//   motorcycle: 'motorcycle.svg',
//   motorcycleRed: 'motorcycle-red.svg',
//   deliveryRed: 'delivery-red.svg',
//   phone: 'phone.svg',
//   bigSize: 'big-size.svg',
//   boxing: 'boxing.svg',
//   openedEye: 'opened-eye.svg',
//   closedEye: 'closed-eye.svg',
//   error: 'error.svg',
//   fetching: 'fetching.svg',
//   move: 'move.svg',
//   apartamentShedule: 'apartamentShedule.svg',
//   handyMoving: 'handyMoving.svg',
//   pickUp: 'pickUp.svg',
//   sameDayPickUp: 'sameDayPickUp.svg',
//   addPhoto: 'addPhoto.svg',
//   trash: 'trash.svg',
//   moveColored: 'moveColored.svg',
//   furniture: 'furniture.png',
//   rooms: 'rooms.png',
//   elevator: 'elevator.png',
//   sliderArrow: 'sliderArrow.svg',
//   chat: 'chat.svg',
//   equal: 'equal.svg',
//   more: 'more.svg',
//   less: 'less.svg',
//   date: 'date.svg',
//   interval: 'interval.svg',
//   largeTruck: 'largeTruck.svg',
//   time: 'time.svg',
//   bigTruck: 'bigTruck.svg',
//   carWash: 'carWash.svg',
//   handUp: 'handup-icon.svg',
//   noImgAvatar: 'no-img-avatar.svg',
//   noUserAvatar: 'no-user-avatar.svg',
//   pointOnMap: 'pointOnMapIcon.svg',
//   callIcon: 'call-icon.svg',
//   moneyIcon: 'money-icon.svg',
//   carIcon: 'car-icon.svg',
//   peopleIcon: 'people-icon.svg',
//   alarmIcon: 'alarm-icon.svg',
//   alarmIconLight: 'alarm-icon-light.svg',
//   carNearbyIcon: 'car-nearby-icon.svg',
//   msgIcon: 'msg-icon.svg',
//   seatSliderArrowRight: 'slider-arrow-right.svg',
//   timeWaitIcon: 'time-wait-icon.svg',
//   checkMarkRed: 'check-mark-red.svg',
//   dollarIcon: 'dollar-icon.svg',
//   arrowDownFrame: 'arrow-down-frame.svg',
//   arrowUpFrame: 'arrow-up-frame.svg',
//   cameraIcon: 'camera-icon.svg',
//   dollarMinimalistic: 'dollarMinimalistic.svg',
//   logo: 'logo.svg',
//   emoji_1: 'emoji_1.png',
//   emoji_2: 'emoji_2.png',
//   emoji_3: 'emoji_3.png',
//   emoji_4: 'emoji_4.png',
//   emoji_5: 'emoji_5.png',
//   emoji_6: 'emoji_6.png',
//   emoji_7: 'emoji_7.png',
//   emoji_7_1: 'emoji_7_1.png',
//   emoji_8: 'emoji_8.png',
// }

// export default new Proxy({}, {
//   get(target, key: keyof typeof names) {
//     return key in names ?
//       `/assets/images/${
//         SITE_CONSTANTS.ICONS_PALETTE_FOLDER &&
//           `${SITE_CONSTANTS.ICONS_PALETTE_FOLDER}/`
//       }${names[key]}` :
//       undefined
//   },
// }) as typeof names

import ActiveAvatar from '../assets/GHA/activeAvatar.svg';
import ArrowDown from '../assets/GHA/arrowDown.svg';
import Arrows from '../assets/GHA/arrows.svg';
import Avatar from '../assets/GHA/avatar.svg';
import BusinessTaxi from '../assets/GHA/business-taxi.svg';
import CarAlt from '../assets/GHA/car-alt.svg';
import Cash from '../assets/GHA/cash.svg';
import CheckMark from '../assets/GHA/check-mark.svg';
import EconomTaxi from '../assets/GHA/econom-taxi.svg';

import FlagFr from '../assets/GHA/flag-fr.svg';
import FlagGb from '../assets/GHA/flag-gb.svg';
import FlagMar from '../assets/GHA/flag-ma.svg';
import FlagRu from '../assets/GHA/flag-ru.svg';

import ActiveMarker from '../assets/GHA/mark-colored.svg';
import InactiveMarker from '../assets/GHA/mark-uncolored.svg';

import CardIconBr from '../assets/GHA/card-icon-br.svg';
import CardIconGrey from '../assets/GHA/card-icon-grey.svg';
import CardIcon from '../assets/GHA/card-icon.svg';
import Card from '../assets/GHA/card.svg';
import ChatIconBr from '../assets/GHA/chat-icon-br.svg';
import ChatIcon from '../assets/GHA/chat-icon.svg';
import ClockGreen from '../assets/GHA/clock-green.svg';
import Clock from '../assets/GHA/clock.svg';
import CloseIcon from '../assets/GHA/close-icon.svg';
import DriverAvatar from '../assets/GHA/driver-avatar.svg';
import SolidCar from '../assets/GHA/fa-solid_car.svg';
import ClockGrey from '../assets/GHA/grey-clock.svg';
import HelpIcon from '../assets/GHA/help-icon.svg';
import MenuIcon from '../assets/GHA/menu-icon.svg';
import MessageIcon from '../assets/GHA/message-icon.svg';
import MinusCircle from '../assets/GHA/minus-circle.svg';
import MinusIcon from '../assets/GHA/minus-icon.svg';
import MultipleUsers from '../assets/GHA/multiple-users.svg';
import NotoTaxi from '../assets/GHA/noto-taxi.svg';
import People from '../assets/GHA/people.svg';
import PhotoCamera from '../assets/GHA/photo-camera.svg';
import PlusCircle from '../assets/GHA/plus-circle.svg';
import PlusIcon from '../assets/GHA/plus-icon.svg';
import Recomended from '../assets/GHA/recomended.svg';
import Requested from '../assets/GHA/requested.svg';
import StarEmpty from '../assets/GHA/star-empty.svg';
import StarFull from '../assets/GHA/star-full.svg';
import Stars from '../assets/GHA/stars.svg';
import SubwayIdCard from '../assets/GHA/subway-id-card.svg';
import Timer from '../assets/GHA/timer.svg';
import TurnBr from '../assets/GHA/turn-br.svg';
import Turn from '../assets/GHA/turn.svg';
import UGroup from '../assets/GHA/u-group.svg';

import MapArrowHome from '../assets/GHA/map-arrow-home.svg';
import MapArrowVoting from '../assets/GHA/map-arrow-voting.svg';
import MapArrow from '../assets/GHA/map-arrow.svg';
import MapIcon from '../assets/GHA/map-icon.svg';
import MapMarkerProfit from '../assets/GHA/map-marker-profit.svg';
import MapOrderPerforming from '../assets/GHA/map-performing.svg';
import MapOrderVoting from '../assets/GHA/map-voting.svg';
import MapOrderWating from '../assets/GHA/map-waiting.svg';

import ClockBlue from '../assets/GHA/clock-blue.svg';
import MarkerFrom from '../assets/GHA/marker-from.svg';
import MarkerGreen from '../assets/GHA/marker-green.svg';
import MarkerTo from '../assets/GHA/marker-to.svg';
import MarkerYellow from '../assets/GHA/marker-yellow.svg';
import PassengerAvatar from '../assets/GHA/passenger-avatar.svg';
import ReturnIcon from '../assets/GHA/return-icon.svg';

import VotingRed from '../assets/GHA/voting-red.svg';
import Voting from '../assets/GHA/voting.svg';
import Waiting from '../assets/GHA/waiting.svg';

import Bicycle from '../assets/GHA/bicycle.svg';
import DeliveryRed from '../assets/GHA/delivery-red.svg';
import Delivery from '../assets/GHA/delivery.svg';
import Foot from '../assets/GHA/foot.svg';
import Light from '../assets/GHA/light.svg';
import MotorcycleRed from '../assets/GHA/motorcycle-red.svg';
import Motorcycle from '../assets/GHA/motorcycle.svg';
import Truck from '../assets/GHA/truck.svg';
import Wagon from '../assets/GHA/wagon.svg';

import BigSize from '../assets/GHA/big-size.svg';
import Boxing from '../assets/GHA/boxing.svg';
import Phone from '../assets/GHA/phone.svg';

import ClosedEye from '../assets/GHA/closed-eye.svg';
import ErrorIcon from '../assets/GHA/error.svg';
import Fetching from '../assets/GHA/fetching.svg';
import Move from '../assets/GHA/move.svg';
import OpenedEye from '../assets/GHA/opened-eye.svg';

import AddPhoto from '../assets/GHA/addPhoto.svg';
import ApartamentShedule from '../assets/GHA/apartamentShedule.svg';
import HandyMoving from '../assets/GHA/handyMoving.svg';
import MoveColored from '../assets/GHA/moveColored.svg';
import PickUp from '../assets/GHA/pickUp.svg';
import SameDayPickUp from '../assets/GHA/sameDayPickUp.svg';
import Trash from '../assets/GHA/trash.svg';

import BigTruck from '../assets/GHA/bigTruck.svg';
import CarWash from '../assets/GHA/carWash.svg';
import Chat from '../assets/GHA/chat.svg';
import DateIcon from '../assets/GHA/date.svg';
import Equal from '../assets/GHA/equal.svg';
import HandUp from '../assets/GHA/handup-icon.svg';
import Interval from '../assets/GHA/interval.svg';
import Less from '../assets/GHA/less.svg';
import More from '../assets/GHA/more.svg';
import SliderArrow from '../assets/GHA/sliderArrow.svg';
import Time from '../assets/GHA/time.svg';

import AlarmIcon from '../assets/GHA/alarm-icon.svg';
import ArrowDownFrame from '../assets/GHA/arrow-down-frame.svg';
import ArrowUpFrame from '../assets/GHA/arrow-up-frame.svg';
import CallIcon from '../assets/GHA/call-icon.svg';
import CameraIcon from '../assets/GHA/camera-icon.svg';
import CarIcon from '../assets/GHA/car-icon.svg';
import CarNearbyIcon from '../assets/GHA/car-nearby-icon.svg';
import CheckMarkRed from '../assets/GHA/check-mark-red.svg';
import DollarIcon from '../assets/GHA/dollar-icon.svg';
import DollarMinimalistic from '../assets/GHA/dollarMinimalistic.svg';
import Logo from '../assets/GHA/logo.svg';
import MoneyIcon from '../assets/GHA/money-icon.svg';
import MsgIcon from '../assets/GHA/msg-icon.svg';
import NoImgAvatar from '../assets/GHA/no-img-avatar.svg';
import NoUserAvatar from '../assets/GHA/no-user-avatar.svg';
import PeopleIcon from '../assets/GHA/people-icon.svg';
import PointOnMap from '../assets/GHA/pointOnMapIcon.svg';
import SeatSliderArrowRight from '../assets/GHA/slider-arrow-right.svg';
import TimeWaitIcon from '../assets/GHA/time-wait-icon.svg';



export default {
  // Флаги (SVG)
  // flagRu: require('../assets/GHA/flag-ru.svg'),
  // flagGb: require('../assets/GHA/flag-gb.svg'),
  // flagFr: require('../assets/GHA/flag-fr.svg'),
  // flagMar: require('../assets/GHA/flag-ma.svg'),
  
  // Эмодзи (PNG)
  emoji_1: require('../assets/default/emoji_1.png'),
  emoji_2: require('../assets/default/emoji_2.png'),
  emoji_3: require('../assets/default/emoji_3.png'),
  emoji_4: require('../assets/default/emoji_4.png'),
  emoji_5: require('../assets/default/emoji_5.png'),
  emoji_6: require('../assets/default/emoji_6.png'),
  emoji_7: require('../assets/default/emoji_7.png'),
  emoji_7_1: require('../assets/default/emoji_7_1.png'),
  emoji_8: require('../assets/default/emoji_8.png'),

  // Мебель/Комнаты (PNG)
  furniture: require('../assets/GHA/furniture.png'),
  rooms: require('../assets/GHA/rooms.png'),
  elevator: require('../assets/GHA/elevator.png'),
  googleIcon: require('../assets/GHA/google-icon.png'),

  loading: require('../assets/GHA/loading.gif'),

  activeMarkerPng: require('../assets/GHA/mark-coloredPng.png'),
  markerFromPng: require('../assets/GHA/marker-fromPng.png'),

  markerToPng: require('../assets/GHA/marker-toPng.png'),
  
  // Все остальные SVG-файлы
  // arrowDown: require('../assets/GHA/arrowDown.svg'),
  // arrows: require('../assets/GHA/arrows.svg'),
  // avatar: require('../assets/GHA/avatar.svg'),
  // activeAvatar: require('../assets/GHA/activeAvatar.svg'),
  // businessTaxi: require('../assets/GHA/business-taxi.svg'),
  // carAlt: require('../assets/GHA/car-alt.svg'),
  // cash: require('../assets/GHA/cash.svg'),
  // checkMark: require('../assets/GHA/check-mark.svg'),
  // economTaxi: require('../assets/GHA/econom-taxi.svg'),
  // activeMarker: require('../assets/GHA/mark-colored.svg'),
  // inactiveMarker: require('../assets/GHA/mark-uncolored.svg'),
  // menuIcon: require('../assets/GHA/menu-icon.svg'),
  // messageIcon: require('../assets/GHA/message-icon.svg'),
  // multipleUsers: require('../assets/GHA/multiple-users.svg'),
  // notoTaxi: require('../assets/GHA/noto-taxi.svg'),
  // plusIcon: require('../assets/GHA/plus-icon.svg'),
  // clock: require('../assets/GHA/clock.svg'),
  // driverAvatar: require('../assets/GHA/driver-avatar.svg'),
  // solidCar: require('../assets/GHA/fa-solid_car.svg'),
  // subwayIdCard: require('../assets/GHA/subway-id-card.svg'),
  // card: require('../assets/GHA/card.svg'),
  // stars: require('../assets/GHA/stars.svg'),
  // starEmpty: require('../assets/GHA/star-empty.svg'),
  // starFull: require('../assets/GHA/star-full.svg'),
  // cardIcon: require('../assets/GHA/card-icon.svg'),
  // photoCamera: require('../assets/GHA/photo-camera.svg'),
  // helpIcon: require('../assets/GHA/help-icon.svg'),
  // timer: require('../assets/GHA/timer.svg'),
  // closeIcon: require('../assets/GHA/close-icon.svg'),
  // cardIconGrey: require('../assets/GHA/card-icon-grey.svg'),
  // chatIcon: require('../assets/GHA/chat-icon.svg'),
  // minusCircle: require('../assets/GHA/minus-circle.svg'),
  // minusIcon: require('../assets/GHA/minus-icon.svg'),
  // plusCircle: require('../assets/GHA/plus-circle.svg'),
  // people: require('../assets/GHA/people.svg'),
  // recomended: require('../assets/GHA/recomended.svg'),
  // requested: require('../assets/GHA/requested.svg'),
  // turn: require('../assets/GHA/turn.svg'),
  // uGroup: require('../assets/GHA/u-group.svg'),
  // clockGrey: require('../assets/GHA/grey-clock.svg'),
  // clockGreen: require('../assets/GHA/clock-green.svg'),
  // turnBr: require('../assets/GHA/turn-br.svg'),
  // cardIconBr: require('../assets/GHA/card-icon-br.svg'),
  // chatIconBr: require('../assets/GHA/chat-icon-br.svg'),
  // mapIcon: require('../assets/GHA/map-icon.svg'),
  // mapArrow: require('../assets/GHA/map-arrow.svg'),
  // mapArrowVoting: require('../assets/GHA/map-arrow-voting.svg'),
  // mapOrderVoting: require('../assets/GHA/map-voting.svg'),
  // mapOrderWating: require('../assets/GHA/map-waiting.svg'),
  // mapOrderPerforming: require('../assets/GHA/map-performing.svg'),
  // mapMarkerProfit: require('../assets/GHA/map-marker-profit.svg'),
  // mapArrowHome: require('../assets/GHA/map-arrow-home.svg'),
  // returnIcon: require('../assets/GHA/return-icon.svg'),
  // passengerAvatar: require('../assets/GHA/passenger-avatar.svg'),
  // clockBlue: require('../assets/GHA/clock-blue.svg'),
  // markerGreen: require('../assets/GHA/marker-green.svg'),
  // markerYellow: require('../assets/GHA/marker-yellow.svg'),
  // markerFrom: require('../assets/GHA/marker-from.svg'),
  // markerTo: require('../assets/GHA/marker-to.svg'),
  // voting: require('../assets/GHA/voting.svg'),
  // votingRed: require('../assets/GHA/voting-red.svg'),
  // waiting: require('../assets/GHA/waiting.svg'),
  // delivery: require('../assets/GHA/delivery.svg'),
  // light: require('../assets/GHA/light.svg'),
  // truck: require('../assets/GHA/truck.svg'),
  // wagon: require('../assets/GHA/wagon.svg'),
  // foot: require('../assets/GHA/foot.svg'),
  // bicycle: require('../assets/GHA/bicycle.svg'),
  // motorcycle: require('../assets/GHA/motorcycle.svg'),
  // motorcycleRed: require('../assets/GHA/motorcycle-red.svg'),
  // deliveryRed: require('../assets/GHA/delivery-red.svg'),
  // phone: require('../assets/GHA/phone.svg'),
  // bigSize: require('../assets/GHA/big-size.svg'),
  // boxing: require('../assets/GHA/boxing.svg'),
  // openedEye: require('../assets/GHA/opened-eye.svg'),
  // closedEye: require('../assets/GHA/closed-eye.svg'),
  // error: require('../assets/GHA/error.svg'),
  // fetching: require('../assets/GHA/fetching.svg'),
  // move: require('../assets/GHA/move.svg'),
  // apartamentShedule: require('../assets/GHA/apartamentShedule.svg'),
  // handyMoving: require('../assets/GHA/handyMoving.svg'),
  // pickUp: require('../assets/GHA/pickUp.svg'),
  // sameDayPickUp: require('../assets/GHA/sameDayPickUp.svg'),
  // addPhoto: require('../assets/GHA/addPhoto.svg'),
  // trash: require('../assets/GHA/trash.svg'),
  // moveColored: require('../assets/GHA/moveColored.svg'),
  // sliderArrow: require('../assets/GHA/sliderArrow.svg'),
  // chat: require('../assets/GHA/chat.svg'),
  // equal: require('../assets/GHA/equal.svg'),
  // more: require('../assets/GHA/more.svg'),
  // less: require('../assets/GHA/less.svg'),
  // date: require('../assets/GHA/date.svg'),
  // interval: require('../assets/GHA/interval.svg'),
  // // largeTruck: require('../assets/GHA/largeTruck.svg'),
  // time: require('../assets/GHA/time.svg'),
  // bigTruck: require('../assets/GHA/bigTruck.svg'),
  // carWash: require('../assets/GHA/carWash.svg'),
  // handUp: require('../assets/GHA/handup-icon.svg'),
  // noImgAvatar: require('../assets/GHA/no-img-avatar.svg'),
  // noUserAvatar: require('../assets/GHA/no-user-avatar.svg'),
  // pointOnMap: require('../assets/GHA/pointOnMapIcon.svg'),
  // callIcon: require('../assets/GHA/call-icon.svg'),
  // moneyIcon: require('../assets/GHA/money-icon.svg'),
  // carIcon: require('../assets/GHA/car-icon.svg'),
  // peopleIcon: require('../assets/GHA/people-icon.svg'),
  // alarmIcon: require('../assets/GHA/alarm-icon.svg'),
  // // alarmIconLight: require('../assets/GHA/alarm-icon-light.svg'),
  // carNearbyIcon: require('../assets/GHA/car-nearby-icon.svg'),
  // msgIcon: require('../assets/GHA/msg-icon.svg'),
  // seatSliderArrowRight: require('../assets/GHA/slider-arrow-right.svg'),
  // timeWaitIcon: require('../assets/GHA/time-wait-icon.svg'),
  // checkMarkRed: require('../assets/GHA/check-mark-red.svg'),
  // dollarIcon: require('../assets/GHA/dollar-icon.svg'),
  // arrowDownFrame: require('../assets/GHA/arrow-down-frame.svg'),
  // arrowUpFrame: require('../assets/GHA/arrow-up-frame.svg'),
  // cameraIcon: require('../assets/GHA/camera-icon.svg'),
  // dollarMinimalistic: require('../assets/GHA/dollarMinimalistic.svg'),
  // logo: require('../assets/GHA/logo.svg'),
  arrowDown: ArrowDown,
  arrows: Arrows,
  avatar: Avatar,
  activeAvatar: ActiveAvatar,
  businessTaxi: BusinessTaxi,
  carAlt: CarAlt,
  cash: Cash,
  checkMark: CheckMark,
  economTaxi: EconomTaxi,

  flagRu: FlagRu,
  flagGb: FlagGb,
  flagFr: FlagFr,
  flagMar: FlagMar,

  activeMarker: ActiveMarker,
  inactiveMarker: InactiveMarker,

  menuIcon: MenuIcon,
  messageIcon: MessageIcon,
  multipleUsers: MultipleUsers,
  notoTaxi: NotoTaxi,
  plusIcon: PlusIcon,
  clock: Clock,
  driverAvatar: DriverAvatar,
  solidCar: SolidCar,
  subwayIdCard: SubwayIdCard,
  card: Card,
  stars: Stars,
  starEmpty: StarEmpty,
  starFull: StarFull,
  cardIcon: CardIcon,
  photoCamera: PhotoCamera,
  helpIcon: HelpIcon,
  timer: Timer,
  closeIcon: CloseIcon,
  cardIconGrey: CardIconGrey,
  chatIcon: ChatIcon,
  minusCircle: MinusCircle,
  minusIcon: MinusIcon,
  plusCircle: PlusCircle,
  people: People,
  recomended: Recomended,
  requested: Requested,
  turn: Turn,
  uGroup: UGroup,
  clockGrey: ClockGrey,
  clockGreen: ClockGreen,
  turnBr: TurnBr,
  cardIconBr: CardIconBr,
  chatIconBr: ChatIconBr,

  mapIcon: MapIcon,
  mapArrow: MapArrow,
  mapArrowVoting: MapArrowVoting,
  mapOrderVoting: MapOrderVoting,
  mapOrderWating: MapOrderWating,
  mapOrderPerforming: MapOrderPerforming,
  mapMarkerProfit: MapMarkerProfit,
  mapArrowHome: MapArrowHome,

  returnIcon: ReturnIcon,
  passengerAvatar: PassengerAvatar,
  clockBlue: ClockBlue,
  markerGreen: MarkerGreen,
  markerYellow: MarkerYellow,
  markerFrom: MarkerFrom,
  markerTo: MarkerTo,

  voting: Voting,
  votingRed: VotingRed,
  waiting: Waiting,
  delivery: Delivery,
  light: Light,
  truck: Truck,
  wagon: Wagon,
  foot: Foot,
  bicycle: Bicycle,
  motorcycle: Motorcycle,
  motorcycleRed: MotorcycleRed,
  deliveryRed: DeliveryRed,

  phone: Phone,
  bigSize: BigSize,
  boxing: Boxing,
  openedEye: OpenedEye,
  closedEye: ClosedEye,
  error: ErrorIcon,
  fetching: Fetching,
  move: Move,

  apartamentShedule: ApartamentShedule,
  handyMoving: HandyMoving,
  pickUp: PickUp,
  sameDayPickUp: SameDayPickUp,
  addPhoto: AddPhoto,
  trash: Trash,
  moveColored: MoveColored,

  sliderArrow: SliderArrow,
  chat: Chat,
  equal: Equal,
  more: More,
  less: Less,
  date: DateIcon,
  interval: Interval,
  time: Time,
  bigTruck: BigTruck,
  carWash: CarWash,
  handUp: HandUp,

  noImgAvatar: NoImgAvatar,
  noUserAvatar: NoUserAvatar,
  pointOnMap: PointOnMap,
  callIcon: CallIcon,
  moneyIcon: MoneyIcon,
  carIcon: CarIcon,
  peopleIcon: PeopleIcon,
  alarmIcon: AlarmIcon,
  carNearbyIcon: CarNearbyIcon,
  msgIcon: MsgIcon,
  seatSliderArrowRight: SeatSliderArrowRight,
  timeWaitIcon: TimeWaitIcon,
  checkMarkRed: CheckMarkRed,
  dollarIcon: DollarIcon,
  arrowDownFrame: ArrowDownFrame,
  arrowUpFrame: ArrowUpFrame,
  cameraIcon: CameraIcon,
  dollarMinimalistic: DollarMinimalistic,
  logo: Logo,
}