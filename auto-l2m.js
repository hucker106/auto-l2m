"auto";


// ========================
// ⚙️ CẤU HÌNH CẬP NHẬT
// ========================
const SCRIPT_NAME = "floaty_tool.js"; // đổi tên đúng với file script của bạn
const VERSION = "1.0.0"; // phiên bản hiện tại
const UPDATE_URL = "https://raw.githubusercontent.com/yourname/yourrepo/main/floaty_tool.js"; 
const VERSION_URL = "https://raw.githubusercontent.com/yourname/yourrepo/main/version.json"; 

// ⚙️ Kiểm tra bản mới (gọi đầu script)
checkForUpdate();

function checkForUpdate() {
  threads.start(function () {
    try {
      toast("🔍 Kiểm tra cập nhật...");
      let res = http.get(VERSION_URL);
      if (res.statusCode !== 200) throw "Không tải được version.json";
      let data = JSON.parse(res.body.string());
      if (compareVersion(data.version, VERSION) > 0) {
        log("⚡ Có bản mới: " + data.version);
        let note = data.note || "";
        if (confirm("Đã có bản mới " + data.version + "\n" + note + "\nCập nhật ngay?")) {
          updateScript(data.version);
        }
      } else {
        log("✅ Đang ở bản mới nhất: " + VERSION);
      }
    } catch (e) {
      log("❌ Lỗi kiểm tra cập nhật: " + e);
    }
  });
}

function updateScript(newVer) {
  try {
    toast("⬇️ Đang tải bản " + newVer + "...");
    let res = http.get(UPDATE_URL);
    if (res.statusCode !== 200) throw "Không tải được file mới.";
    let path = files.path(SCRIPT_NAME);
    files.write(path, res.body.string());
    toast("✅ Đã cập nhật lên bản " + newVer + ". Khởi động lại script!");
    exit();
  } catch (e) {
    toast("❌ Lỗi cập nhật: " + e);
  }
}

function compareVersion(v1, v2) {
  let a1 = v1.split('.').map(Number);
  let a2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(a1.length, a2.length); i++) {
    let n1 = a1[i] || 0, n2 = a2[i] || 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}


const CONFIG_PATH = "/sdcard/Download/floaty_config.json";
var expanded = false;
var lastAction = Date.now();
var stickSide = "right";
var now = Date.now();
var isRunning = false;
var isPaused = false;
var iconY = 100;
var configMode = "Trung bình";  // 👈 thêm dòng này (mặc định)


function saveConfig() {
  try {
    let config = {
      stickSide: stickSide,
      iconY: iconY,
      // isRunning: isRunning,
      // isPaused: isPaused,
      configMode: configMode   // 👈 thêm vào
      // thêm biến khác ở đây
    };
    files.write(CONFIG_PATH, JSON.stringify(config));
  } catch (e) {
    log("Save config error: " + e);
  }
}

// === Đọc config từ file ===
function loadConfig() {
  try {
    if (files.exists(CONFIG_PATH)) {
      let c = JSON.parse(files.read(CONFIG_PATH));
      stickSide = c.stickSide || "right";
      iconY = c.iconY || 100;
      console.log(iconY);
      // isRunning = c.isRunning || false;
      // isPaused = c.isPaused || false;
      configMode = c.configMode || "Trung bình"; // 👈 thêm vào
      // đọc thêm biến khác ở đây
    }
  } catch (e) {
    log("Load config error: " + e);
  }
}
// === Kiểm tra màn hình ngang/dọc ===
function isLandscape() { return device.width > device.height; }
function isPortrait() { return !isLandscape(); }

// === Ví dụ khi bắt đầu script ===
loadConfig();

let settingsWin = floaty.window(
  <frame bg="#FFFFFF">   <!-- Nền trắng -->
    <scroll>
      <vertical padding="10">
        <text text="⚙️ Tùy chọn" textSize="18sp" textColor="#000000" marginBottom="8" /> <!-- Chữ đen -->

        <horizontal>
          <checkbox id="chk1" text="Biến thân" textColor="#000000" />
          <checkbox id="chk2" text="Cưỡi thú" textColor="#000000" />
          <checkbox id="chk3" text="Phân giải" textColor="#000000" />
          <spinner id="spin1" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>

        <horizontal>
          <checkbox id="chk4" text="Trang bị" textColor="#000000" />
          <checkbox id="chk5" text="Cường hóa" textColor="#000000" />
          <checkbox id="chk6" text="Thu thập" textColor="#000000" />
          <spinner id="spin2" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>

        <horizontal>
          <checkbox id="chk11" text="Biến thân" textColor="#000000" />
          <checkbox id="chk21" text="Cưỡi thú" textColor="#000000" />
          <checkbox id="chk31" text="Phân giải" textColor="#000000" />
          <spinner id="spin11" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>

        <horizontal>
          <checkbox id="chk42" text="Trang bị" textColor="#000000" />
          <checkbox id="chk52" text="Cường hóa" textColor="#000000" />
          <checkbox id="chk62" text="Thu thập" textColor="#000000" />
          <spinner id="spin22" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>

        <horizontal>
          <checkbox id="chk43" text="Trang bị" textColor="#000000" />
          <checkbox id="chk53" text="Cường hóa" textColor="#000000" />
          <checkbox id="chk63" text="Thu thập" textColor="#000000" />
          <spinner id="spin23" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>
        <horizontal>
          <checkbox id="chk44" text="Trang bị" textColor="#000000" />
          <checkbox id="chk54" text="Cường hóa" textColor="#000000" />
          <checkbox id="chk64" text="Thu thập" textColor="#000000" />
          <spinner id="spin24" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>
        <horizontal>
          <checkbox id="chk45" text="Trang bị" textColor="#000000" />
          <checkbox id="chk55" text="Cường hóa" textColor="#000000" />
          <checkbox id="chk65" text="Thu thập" textColor="#000000" />
          <spinner id="spin25" entries="Trắng,Xanh,Lục,Đỏ,Tím" w="90" />
        </horizontal>
      </vertical>
    </scroll>

    <horizontal
      w="*"
      h="wrap_content"
      margin="10"
      layout_gravity="bottom|right">

      <button id="btnClose" text="❌ Đóng" w="wrap_content" marginRight="10" />
      <button id="btnSave" text="💾 Lưu" w="wrap_content" />
    </horizontal>

  </frame >
);



// đặt vị trí & size
settingsWin.setPosition(-9999, -9999);
settingsWin.setSize(600, -2); // 600px ngang, cao tự động

// load config
// settingsWin.chk_autoStart.checked = isRunning;
// let modes = ["Nhanh", "Trung bình", "Chậm"];
// let idx = modes.indexOf(configMode);
// if (idx >= 0) settingsWin.spinner_mode.setSelection(idx);

// nút Lưu
settingsWin.btnSave.click(() => {
  // isRunning = settingsWin.chk_autoStart.checked;
  // configMode = settingsWin.spinner_mode.getSelectedItem();
  // saveConfig();
  toast("Đã lưu config");
});

// nút Đóng
settingsWin.btnClose.click(() => {
  ui.run(() => {
    settingsWin.setPosition(-9999, -9999);
    toast("Đã dóng config");
  });
});

function showSettingsFloaty() {
  log("⚙️ showSettingsFloaty() called");  // debug
  ui.run(() => {
    settingsWin.setPosition(50, 50);
  });
}

function getOrientation(callback) {
  ui.run(() => {
    try {
      let conf = context.getResources().getConfiguration();
      callback(conf.orientation);
    } catch (e) {
      console.error("getOrientation lỗi: " + e);
      callback(-1); // báo lỗi
    }
  });
}

// Hàm kiểm tra ngang/dọc
function isGameLandscape(cb) {
  getOrientation(ori => {
    cb(ori == 2); // 2 = Landscape
  });
}

const AUTO_HIDE_DELAY = 5000; // ms

// === Icon chính ===
var window = floaty.window(
  <frame bg="#eeee90">
    <text id="icon" text="≡" textSize="40sp" textColor="#FFFFFF" bg="#AA000000" padding="6" w="15"/>
  </frame>
);



function setIconBg(colorHex) {
  ui.run(() => {
    window.icon.setBackgroundColor(colors.parseColor(colorHex));
  });
}


function highlightIcon() {
  setIconBg("#f08ee5ff"); // nền sáng hơn
}

function resetIcon() {
  setIconBg("#eeee90"); // nền ban đầu
}

// === Menu riêng ===
var menu = floaty.window(
  <linear id="btns" orientation="horizontal" padding="6" visibility="gone">
    <button id="start" text="🔵" w="60" textSize="30sp" />
    {/* <button id="stop" text="■" w="60" textSize="20sp" /> */}
    <button id="pause" text="▶" w="60" textSize="30sp" />
    <button id="optMenu" text="⚙" w="60" textSize="30sp" />
    <button id="btnExit" text="❌" w="60" textSize="30sp" />
  </linear>
);

menu.setSize(-2, -2); // wrap content
menu.setPosition(-9999, -9999); // giấu đi

// show menu (thẳng hàng theo icon Y, nằm sát mép trái/phải)
function showButtons() {
  ui.run(() => {
    try {
      // hiện menu (để Android đo kích thước)
      menu.btns.setVisibility(0);

      // chờ layout xong rồi mới set position
      menu.btns.post(() => {
        // lấy lại kích thước màn hình theo orientation hiện tại
        let conf = context.getResources().getConfiguration();
        let isLandscape = (conf.orientation == 2);

        let screenW = isLandscape ? Math.max(device.width, device.height)
          : Math.min(device.width, device.height);
        let screenH = isLandscape ? Math.min(device.width, device.height)
          : Math.max(device.width, device.height);

        let mw = menu.btns.getWidth();
        let mh = menu.btns.getHeight();

        // X: dính mép trái hoặc phải
        let x = (stickSide === "left") ? 70 : (screenW - mw - 70);

        // căn Y theo icon
        let iconY1 = iconY;
        let iconH = window.icon.getHeight();
        let y = Math.round(iconY1 + iconH / 2 - mh / 2);

        // clamp để không vượt màn hình
        if (y < 0) y = 0;
        if (y + mh > screenH) y = screenH - mh;

        // cập nhật vị trí menu
        menu.setPosition(x, y);
      });
    } catch (e) {
      log("showButtons err: " + e);
    }
  });
  expanded = true;
  lastAction = Date.now();
}

// hide menu
function hideButtons() {
  ui.run(() => {
    if (!expanded) return;
    menu.btns.setVisibility(8);
    // giấu menu khỏi màn hình
    menu.setPosition(-9999, -9999);
  });
  expanded = false;
}

// === Kéo icon ===
var startX, startY, downX, downY, moved;

window.icon.setOnTouchListener(function (view, event) {
  try {
    var action = event.getAction();
    if (action == event.ACTION_DOWN) {
      startX = window.getX();
      startY = window.getY();
      downX = event.getRawX();
      downY = event.getRawY();
      moved = false;
      return true;
    }
    if (action == event.ACTION_MOVE) {
      var dx = event.getRawX() - downX;
      var dy = event.getRawY() - downY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      window.setPosition(startX + dx, startY + dy);
      return true;
    }
    if (action == event.ACTION_UP) {
      try {
        if (!moved) {
          if (expanded) hideButtons(); else showButtons();
        } else {
          var rawX = event.getRawX();

          // ✅ Lấy orientation từ hệ thống
          let conf = context.getResources().getConfiguration();
          let isLandscape = (conf.orientation == android.content.res.Configuration.ORIENTATION_LANDSCAPE);

          let screenW = isLandscape ? Math.max(device.width, device.height) : device.width;

          // cập nhật stickSide
          stickSide = rawX < screenW / 2 ? "left" : "right";

          setTimeout(() => {
            stickToEdgeKeepY();
            saveConfig();
          }, 120);
        }
        return true;
      } catch (e) {
        log("touch err: " + e);
      }
    }
  } catch (e) {
    log("touch err: " + e);
  }
  return false;
});


// === Dính mép ===
function stickToEdgeKeepY(useConfig) {

  let conf = context.getResources().getConfiguration();
  let isLandscape = (conf.orientation == 2);

  let screenW = isLandscape ? Math.max(device.width, device.height)
    : Math.min(device.width, device.height);
  let screenH = isLandscape ? Math.min(device.width, device.height)
    : Math.max(device.width, device.height);


  var iconW = window.icon.getWidth();
  var h = window.getHeight();

  // Nếu đang load từ config thì lấy iconY đã lưu
  var y;
  if (useConfig && typeof iconY === "number") {
    y = iconY;
  } else {
    y = window.getY();
    iconY = y; // cập nhật để sau này saveConfig đúng
  }

  // clamp Y
  if (y < 0) y = 0;
  if (y + h > screenH) y = screenH - h;

  var targetX = (stickSide === "left") ? 0 : (screenW - iconW);
  window.setPosition(targetX, y);
}

// === Nút menu ===
ui.run(() => {

  // Toggle Start/Stop
  menu.start.click(() => {
    if (isRunning) {
      menu.start.setText("🔵"); // đổi lại nút Start
      toast("Stopped");
      menu.pause.setText("▶"); // đổi thành Play
      resetIcon();
    } else {
      menu.start.setText("■"); // đổi thành Stop
      toast("Started");
      menu.pause.setText("⏸"); // đổi lại nút Pause
      toast("Resumed");
      highlightIcon(); // nền sáng hơn

    }
    isRunning = !isRunning;
    lastAction = Date.now();
  });

  // Toggle Pause/Play
  menu.pause.click(() => {
    if (isRunning) {
      if (isPaused) {
        menu.pause.setText("⏸"); // đổi lại nút Pause
        toast("Resumed");
      } else {
        menu.pause.setText("▶"); // đổi thành Play
        toast("Paused");
      }
      isPaused = !isPaused;
    }
    lastAction = Date.now();
  });

  menu.btnExit.click(() => {
    toast("Thoát script");
    try { window.close(); menu.close(); } catch (e) { }
    exit();
  });
  menu.optMenu.click(() => {
    if (isRunning) {
      toast("auto đang chạy");
    } else {
      hideButtons();
      toast("Settings");
      showSettingsFloaty(); // gọi hàm
      lastAction = Date.now();
    }
  });

});

threads.start(function () {
  let lastOrientation = context.getResources().getConfiguration().orientation;

  while (true) {
    try {
      let conf = context.getResources().getConfiguration();
      let currentOrientation = conf.orientation;

      // Nếu orientation thay đổi
      if (currentOrientation != lastOrientation) {
        console.log("📐 Orientation changed:", currentOrientation);

        ui.run(() => {
          try {
            stickToEdgeKeepY(true); // reposition icon
            if (expanded) {
              hideButtons();
              showButtons();
            }
          } catch (e) {
            log("ui.run err: " + e);
          }
        });

        lastOrientation = currentOrientation;
      }

      // Nếu menu đang mở thì check idle để auto-hide
      if (expanded) {
        let idle = Date.now() - lastAction;
        if (idle > AUTO_HIDE_DELAY) {
          console.log("⏱ Tự động ẩn menu sau", idle, "ms");
          ui.run(() => hideButtons());
        }
      }

    } catch (e) {
      log("bg err: " + e);
    }
    sleep(500);
  }
});



// bắt đầu chỉ hiện icon và dính mép
hideButtons();
sleep(100);
// Đặt vị trí sau khi floaty layout xong
setTimeout(() => {
  stickToEdgeKeepY(true); // true = dùng iconY từ config
}, 200);
// giữ script sống
setInterval(() => { }, 1000);
