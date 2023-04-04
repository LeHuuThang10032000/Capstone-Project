<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColMessageToShareBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('share_bills', function (Blueprint $table) {
            $table->string('message')->nullable();
            $table->unsignedBigInteger('transaction_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('share_bills', function (Blueprint $table) {
            $table->dropColumn(['message', 'transaction_id']);
        });
    }
}
