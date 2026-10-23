<!-- Documents how Flutter receives upgrade checkout results.
Owns the JavaScript channel contract and a webview_flutter integration example.
Does not implement the mobile upgrade route or confirm backend entitlement. -->

# Flutter upgrade WebView

Register the `CipherwillUpgrade` JavaScript channel **before loading** the page.
Enable unrestricted JavaScript so Paddle checkout can run. Open the upgrade link
with URL-encoded values from GraphQL `me.email` and `me.id`:

```text
https://www.cipherwill.com/upgrade?email=EMAIL&user_id=ACCOUNT_ID
```

The channel receives a JSON string when checkout reports a terminal result:

```json
{"type":"cipherwill.upgrade","status":"success"}
```

```json
{"type":"cipherwill.upgrade","status":"error","code":"checkout.payment.failed","message":"Checkout could not be completed. Please try again."}
```

Close the WebView on either status and return the result to the caller. Error
messages can also report an invalid link, unavailable checkout configuration,
Paddle initialization failure, or failure to open checkout. The payload contains
no email or account ID. Only one result is delivered per checkout attempt.

## webview_flutter example

This example belongs inside the upgrade WebView widget's `State`. Render its
controller using `WebViewWidget(controller: _controller)` and call
`loadUpgrade(email: ..., accountId: ...)` during initialization.

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

final _controller = WebViewController();
bool _resultHandled = false;

Future<void> loadUpgrade({required String email, required String accountId}) async {
  await _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
  await _controller.addJavaScriptChannel(
    'CipherwillUpgrade',
    onMessageReceived: (event) {
      if (!mounted || _resultHandled) return;
      final result = jsonDecode(event.message);
      if (result is! Map<String, dynamic> ||
          result['type'] != 'cipherwill.upgrade' ||
          (result['status'] != 'success' && result['status'] != 'error')) {
        return;
      }
      _resultHandled = true;
      Navigator.of(context).pop(result);
    },
  );
  await _controller.loadRequest(Uri.https(
    'www.cipherwill.com',
    '/upgrade',
    {'email': email, 'user_id': accountId},
  ));
}
```

After success, refresh the account/subscription from the backend. Paddle's
checkout event can arrive before the payment webhook finishes processing; the
WebView message is not confirmation that Premium has already been activated.

Without the native channel, the browser retains the existing success and error
screens. Closing Paddle's overlay alone leaves the upgrade page open and does
not send a success or error result.
