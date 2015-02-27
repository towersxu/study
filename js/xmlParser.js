/**
 * Created by xt on 15-1-4.
 */
function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        return xml.nodeValue;
    } else if (xml.nodeType == 4) {  //cdata
        return xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        var xmlChildren = xml.childNodes;
        var xmlLength = xmlChildren.length;
        for (var i = 0; i < xmlLength; i++) {
            var item = xmlChildren.item(i);
            var nodeName = item.nodeName;
            if (nodeName == "#text" || nodeName == "#cdata-section") {
                obj = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (Object.prototype.toString.call(obj[nodeName]) === '[object Array]') {
                        obj[nodeName].push(xmlToJson(item));
                    } else {
                        var arr = [];
                        arr.push(obj[nodeName]);
                        arr.push(xmlToJson(item));
                        obj[nodeName] = arr;
                    }
                }
            }
        }
    }
    return obj;
}

function loadXML(xmlString) {
    var xmlDoc = null;
    //判断浏览器的类型
    //支持IE浏览器
    if (!window.DOMParser && window.ActiveXObject) {   //window.DOMParser 判断是否是非ie浏览器
        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
        for (var i = 0; i < xmlDomVersions.length; i++) {
            try {
                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                break;
            } catch (e) {
            }
        }
    }
    //支持Mozilla浏览器
    else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
        try {
            /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
             * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
             * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
             * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
             */
            domParser = new DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
        } catch (e) {
        }
    }
    else {
        return null;
    }
    return xmlDoc;
}
