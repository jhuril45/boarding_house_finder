import { date, useQuasar } from "quasar";
export default function useFormatter() {
  const $q = useQuasar();

  function getTimeAgo(date_from, short = false, concat = 4, multiple = 1000) {
    var date_now = new Date();
    var time = new Date(date_from * multiple);
    time = time.getTime();
    var diff = time - date_now.getTime();
    diff /= 1000;
    return secondsTotime(Math.round(diff), true, true, true, short, concat);
  }

  function getPad(n, is_use = true) {
    if (is_use) {
      return (n < 10 ? "0" : "") + n;
    } else {
      return n;
    }
  }

  function secondsTotime(
    secondsValue,
    text = false,
    pad = true,
    prefix = true,
    short = false,
    concat = 4
  ) {
    if (concat === 0) {
      concat = 4;
    }
    var days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      future = parseInt(secondsValue) >= 0;

    let value = future ? "In " : "";

    secondsValue = Math.abs(secondsValue);
    if (secondsValue >= 0) {
      days = getPad(parseInt(secondsValue / 86400), pad);
      secondsValue = secondsValue % 86400;

      hours = getPad(parseInt(secondsValue / 3600), pad);
      secondsValue = secondsValue % 3600;

      minutes = getPad(parseInt(secondsValue / 60), pad);
      seconds = getPad(parseInt(secondsValue % 60), pad);
    } else {
      days = hours = minutes = seconds = 0;
    }

    if (text === true) {
      if (days && days.toString() !== "00" && days !== 0) {
        if (concat > 0) {
          concat -= 1;
          value += parseInt(days).toString();

          value += short ? "d " : parseInt(days) === 1 ? "day " : "days ";
        }
      }
      if (hours && hours.toString() !== "00" && hours !== 0) {
        if (concat > 0) {
          concat -= 1;
          value += parseInt(hours).toString();
          value += short ? "h " : parseInt(hours) === 1 ? "hour " : "hours ";
        }
      }
      if (minutes && minutes.toString() !== "00" && minutes !== 0) {
        if (concat > 0) {
          concat -= 1;
          value += parseInt(minutes).toString();
          value += short ? "m " : parseInt(minutes) === 1 ? "min. " : "min. ";
        }
      }

      if (parseInt(secondsValue) === 0) {
        value += " just now";
      } else if (seconds && seconds.toString() !== "00" && seconds !== 0) {
        if (concat > 0) {
          concat -= 1;
          value += parseInt(seconds).toString();
          value += parseInt(seconds) === 1 ? "s " : "s ";
        }
      }

      if (parseInt(secondsValue) !== 0) {
        value += future ? "" : "ago";
      }
    } else {
      value = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }

    return value;
  }

  function formatDateDisplay(
    dateObj,
    format = "MMM, DD YYYY hh:mm A",
    timeZone = null
  ) {
    if (timeZone) {
      dateObj = new Date(
        new Date(dateObj).toLocaleString("en", {
          timeZone: "Africa/Nairobi",
        })
      );
    }

    return date.formatDate(dateObj, format);
  }

  function getDateDifference(
    unit = "days",
    from = new Date(),
    to = new Date(),
    is_date = false
  ) {
    const date_from = from ? new Date(from) : new Date();
    const date_to = to ? new Date(to) : new Date();
    const diff = date.getDateDiff(date_from, date_to, unit);

    if (is_date) {
      return diff >= 0
        ? date.addToDate(date_from, { days: diff })
        : date.subtractFromDate(date_from, { days: Math.abs(diff) });
    }
    return diff;
  }

  function addDate(from = new Date(), diff = 0, unit = "days") {
    const obj = {
      years: unit === "years" ? Math.abs(diff) : 0,
      months: unit === "months" ? Math.abs(diff) : 0,
      days: unit === "days" ? Math.abs(diff) : 0,
      hours: unit === "hours" ? Math.abs(diff) : 0,
      minutes: unit === "minutes" ? Math.abs(diff) : 0,
      seconds: unit === "seconds" ? Math.abs(diff) : 0,
    };
    const date_from = from ? new Date(from) : new Date();
    return diff >= 0
      ? date.addToDate(date_from, obj)
      : date.subtractFromDate(date_from, obj);
  }

  function getLocalAssetUrl(src) {
    return require(`@/assets/${src}`);
  }

  function prepareFiles(files, filesArray) {
    return new Promise(async (resolve, reject) => {
      files = Array.from(files);
      for (const file of files.filter(
        (x) =>
          filesArray.findIndex(
            (y) =>
              x.name === y.name &&
              x.type === y.type &&
              x.size === y.size &&
              x.lastModified === y.lastModified
          ) < 0
      )) {
        const fileObj = await convertFileBase64(file);
        filesArray.push({
          fileIndex: parseInt(filesArray.length + 1),
          extension: fileObj.extension,
          fileName: fileObj.name.split("." + fileObj.extension)[0],
          name: fileObj.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          link: fileObj.data,

          description: "",
        });
      }

      resolve(filesArray);
    });
  }

  function getFileIndex(file, filesArray) {
    return new Promise(async (resolve, reject) => {
      const index = filesArray.findIndex(
        (f) => f.fileIndex === file.fileIndex && f.fileName === file.fileName
      );
      resolve(index);
    });
  }

  function updateFilesContent(
    file,
    description,
    field = "description",
    filesArray
  ) {
    return new Promise(async (resolve, reject) => {
      const index = filesArray.findIndex(
        (f) => f.fileIndex === file.fileIndex && f.fileName === file.fileName
      );
      if (index >= 0) {
        filesArray[index][field] = description;
      }

      resolve(filesArray);
    });
  }

  function convertFileBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        resolve({
          name: file.name,
          type: file.type,
          data: event.target.result,
          extension: file.name.substring(
            file.name.lastIndexOf(".") + 1,
            file.name.length
          ),
        });
      };
    });
  }

  function isEdited(object) {
    let is_edited = false;
    const obj = {};
    for (const key in object) {
      if (object[key] !== null) is_edited = true;
    }
    return is_edited;
  }

  function getEditedAttribute(newValue, oldValue) {
    const obj = {};
    for (const key in newValue) {
      obj[key] = newValue[key] !== oldValue[key] ? newValue[key] : null;
    }
    return obj;
  }

  function getRandomColor(colors_added = []) {
    let color = null;
    while (color === null || colors_added.includes(color)) {
      color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    }
    return color;
  }

  function getDateList() {
    return [
      {
        id: 1,
        title: "JAN",
        start: "2023-01-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-01-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 2,
        title: "FEB",
        start: "2023-02-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-02-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 3,
        title: "MAR",
        start: "2023-03-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-03-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 4,
        title: "APR",
        start: "2023-04-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-04-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 5,
        title: "MAY",
        start: "2023-05-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-05-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 6,
        title: "JUN",
        start: "2023-06-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-06-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 7,
        title: "JUL",
        start: "2023-07-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-07-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 8,
        title: "AUG",
        start: "2023-08-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-08-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 9,
        title: "SEP",
        start: "2023-09-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-09-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 10,
        title: "OCT",
        start: "2023-10-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-10-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 11,
        title: "NOV",
        start: "2023-11-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-11-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
      {
        id: 12,
        title: "DEC",
        start: "2023-12-01",
        end: date.formatDate(
          date.endOfDate(new Date("2023-12-01"), "month"),
          "YYYY-MM-DD"
        ),
      },
    ];
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function getYoutubeID(url, bool = false) {
    var r,
      val,
      rx =
        /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    r = url.match(rx);

    val = r != null && typeof r[1] !== "undefined" ? r[1] : false;

    return bool ? !!val : val;
  }

  function getLocalAssetUrl(src) {
    return new URL(`/assets/${src}`, import.meta.url).href;
    // return `/assets/${src}`
    // return (await import(/* @vite-ignore */`/assets/${src}`)).default;
  }

  function getImageUrl(image) {
    if (
      image &&
      (image.indexOf("facebook") > -1 || image.indexOf("google") > -1)
    ) {
      image += "?type=normal";
    } else if (image && !image.includes("http")) {
      image = "https://onlywinners.vote/app/uploads/" + image;
    }
    return image;
  }

  function replaceURLs(message) {
    if (!message) return;

    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, function (url) {
      var hyperlink = url;
      var url_display = url.replace("https://", "");
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
        url_display = url.replace("https://", "");
      }
      return (
        '<a href="' +
        hyperlink +
        '" target="_blank" rel="noopener noreferrer">' +
        url_display +
        "</a>"
      );
    });
  }

  function formatCurrency(amount, currency = "PHP", dec = 2) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  function objectToFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      console.log("objectToFormData key", key);
      console.log("objectToFormData object", object[key]);
      if (object[key]) formData.append(key, object[key]);
    });
    return formData;
  }

  function numberSeparateComma(val) {
    var sign = 1;
    if (val < 0) {
      sign = -1;
      val = -val;
    }
    let num = val.toString().includes(".")
      ? val.toString().split(".")[0]
      : val.toString();
    let len = num.toString().length;
    let result = "";
    let count = 1;

    for (let i = len - 1; i >= 0; i--) {
      result = num.toString()[i] + result;
      if (count % 3 === 0 && count !== 0 && i !== 0) {
        result = "," + result;
      }
      count++;
    }

    if (val.toString().includes(".")) {
      result = result + "." + val.toString().split(".")[1];
    }

    return sign < 0 ? "-" + result : result;
  }

  function getStatusColor(status, type = "delivery") {
    if (type === "delivery") {
      const deliveryColors = {
        pending: "warning",
        delivered: "green",
        closed: "red",
      };
      return deliveryColors[status.toLowerCase()] || "green";
    }
    return "info";
  }

  function findArrayOption(key = "id", value, array) {
    return array.find((x) => x[key] === value);
  }

  function showNotify(type = "positive", message) {
    $q.notify({
      type,
      message,
    });
  }

  function getDemandStatusColor(status = "on-going", type = "demands") {
    const colors = {
      demands: {
        "on-going": "teal",
        closed: "red",
        "on-delivery": "cyan",
        completed: "green",
        pending: "yellow",
      },
      consolidated_demands: {
        pooling: "teal",
        processing: "yellow",
        "on-delivery": "cyan",
        completed: "green",
      },
    };

    return colors[type][status];
  }

  function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }

  async function selectFilterObject(
    val,
    update,
    array,
    label = "name",
    value = "id"
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let filtered_objects = [];
        if (val === "") {
          update(() => {
            filtered_objects = array.map((x) => ({
              // label: x.full_name,
              label: capitalizeFirstLetter(x[label]),
              value: x[value],
            }));
          });
          resolve(filtered_objects);
          return;
        }

        update(() => {
          filtered_objects = array
            .filter((v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
            .map((x) => ({
              label: capitalizeFirstLetter(x[label]),
              value: x[value],
            }));

          resolve(filtered_objects);
        });
      } catch (error) {
        console.log("checkAuth error", error);
        resolve([]);
      } finally {
        resolve();
      }
    });
  }

  function fetchCropImage(path) {
    return path
      ? process.env.API_HOST + "/storage/" + path
      : "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg";
  }

  return {
    secondsTotime,
    getPad,
    getTimeAgo,
    formatDateDisplay,
    getDateDifference,
    addDate,
    getLocalAssetUrl,
    convertFileBase64,
    prepareFiles,
    getFileIndex,
    updateFilesContent,
    isEdited,
    getEditedAttribute,
    getRandomColor,
    getDateList,
    capitalizeFirstLetter,
    getYoutubeID,
    getImageUrl,
    replaceURLs,
    formatCurrency,
    numberSeparateComma,
    getStatusColor,
    findArrayOption,
    showNotify,
    getDemandStatusColor,
    truncateToDecimals,
    objectToFormData,
    selectFilterObject,
    fetchCropImage,
  };
}
